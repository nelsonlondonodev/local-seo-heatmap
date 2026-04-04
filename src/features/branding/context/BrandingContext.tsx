import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { BrandingConfig, Agency, BrandingState } from '../types';
import { brandingService } from '../services/brandingService';
import { DEFAULT_BRANDING } from '@/config/constants';

interface BrandingContextType extends BrandingState {
  setAgencyId: (id: string | null) => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

/**
 * Optimized BrandingProvider.
 * Uses useMemo for the context value to prevent unnecessary re-render chains.
 */
export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 1. Fetch agency configuration from Supabase
  useEffect(() => {
    if (!agencyId) {
      setAgency(null);
      return;
    }

    const fetchAgency = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await brandingService.getAgencyById(agencyId);
        if (mounted) setAgency(data);
      } catch (err) {
        console.error('[BRANDING] Fetch error:', err);
        if (mounted) setError(err instanceof Error ? err : new Error('Unknown error fetching agency'));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    let mounted = true;
    fetchAgency();
    return () => { mounted = false; };
  }, [agencyId]);

  // 2. Reactively inject CSS Variables into the DOM root
  useEffect(() => {
    const root = document.documentElement;
    const syncVar = (name: string, value: string | null | undefined, fallback: string) => {
      if (value) {
        root.style.setProperty(name, value);
      } else {
        root.style.setProperty(name, fallback);
      }
    };

    if (agency) {
      syncVar('--brand-primary', agency.primary_color, DEFAULT_BRANDING.primaryColor);
      syncVar('--brand-secondary', agency.secondary_color, DEFAULT_BRANDING.secondaryColor);
      syncVar('--brand-accent', agency.accent_color, DEFAULT_BRANDING.accentColor);
    } else {
      syncVar('--brand-primary', null, DEFAULT_BRANDING.primaryColor);
      syncVar('--brand-secondary', null, DEFAULT_BRANDING.secondaryColor);
      syncVar('--brand-accent', null, DEFAULT_BRANDING.accentColor);
    }
  }, [agency]);

  // 3. SECURE MEMOIZATION: This prevents the Router and sync components from looping
  const config = useMemo<BrandingConfig>(() => ({
    name: agency?.name || DEFAULT_BRANDING.name,
    logoUrl: agency?.logo_url || DEFAULT_BRANDING.logoUrl,
    primaryColor: agency?.primary_color || DEFAULT_BRANDING.primaryColor,
    secondaryColor: agency?.secondary_color || DEFAULT_BRANDING.secondaryColor,
    accentColor: agency?.accent_color || DEFAULT_BRANDING.accentColor,
  }), [agency]);

  const value = useMemo(() => ({
    config,
    agency,
    isLoading,
    error,
    setAgencyId,
  }), [config, agency, isLoading, error]);

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
