import { useContext } from 'react';
import { AppContext } from './appContextValue';
import type { AppContextType } from '../types';

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
