import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { BrandingConfig, Agency, BrandingState } from '../types';
import { brandingService } from '../services/brandingService';
import { APP_CONFIG } from '@/config/constants';

const DEFAULT_BRANDING: BrandingConfig = {
  name: APP_CONFIG.name,
  logoUrl: null,
  primaryColor: null, // Let CSS fallback to --primary
  secondaryColor: null, // Let CSS fallback to --secondary
};

interface BrandingContextType extends BrandingState {
  setAgencyId: (id: string | null) => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch agency data when agencyId changes
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
        setAgency(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error fetching agency'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgency();
  }, [agencyId]);

  // Inject CSS Variables for the current agency
  useEffect(() => {
    const root = document.documentElement;
    
    if (agency) {
      if (agency.primary_color) {
        root.style.setProperty('--brand-primary', agency.primary_color);
      }
      if (agency.secondary_color) {
        root.style.setProperty('--brand-secondary', agency.secondary_color);
      }
    } else {
      // Revert to defaults
      root.style.removeProperty('--brand-primary');
      root.style.removeProperty('--brand-secondary');
    }
  }, [agency]);

  const config = useMemo<BrandingConfig>(() => ({
    name: agency?.name || DEFAULT_BRANDING.name,
    logoUrl: agency?.logo_url || DEFAULT_BRANDING.logoUrl,
    primaryColor: agency?.primary_color || DEFAULT_BRANDING.primaryColor,
    secondaryColor: agency?.secondary_color || DEFAULT_BRANDING.secondaryColor,
  }), [agency]);

  const value = {
    config,
    agency,
    isLoading,
    error,
    setAgencyId,
  };

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
