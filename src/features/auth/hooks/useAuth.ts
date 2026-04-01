import { useContext, createContext } from 'react';
import type { AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to access the Auth Context.
 * Separated into its own file to support Vite Fast Refresh.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
