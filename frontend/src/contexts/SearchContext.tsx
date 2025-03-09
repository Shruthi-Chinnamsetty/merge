// src/contexts/SearchContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Destination, AdvancedSearchParams } from '../types';
import { 
  getAllDestinations, 
  searchDestinations, 
  advancedSearch, 
  addDestination as addDestinationService 
} from '../destinationService';


interface SearchContextState {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  advancedSearchParams: AdvancedSearchParams;
  isAdvancedSearch: boolean;
  
  fetchAllDestinations: () => Promise<void>;
  performSearch: (query: string) => Promise<void>;
  performAdvancedSearch: (params: AdvancedSearchParams) => Promise<void>;
  toggleSearchMode: () => void;
  setSearchQuery: (query: string) => void;
  setAdvancedSearchParams: (params: AdvancedSearchParams) => void;
  clearError: () => void;
  addDestination: (destination: Omit<Destination, 'id'>) => Promise<void>;

  
}

// Create the context with default values
const SearchContext = createContext<SearchContextState | undefined>(undefined);

// Props for the provider component
interface SearchProviderProps {
  children: ReactNode;
}

// Provider component that wraps parts of your app that need access to the context
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [advancedSearchParams, setAdvancedSearchParams] = useState<AdvancedSearchParams>({
    name: '',
    country: ''
  });
  const [isAdvancedSearch, setIsAdvancedSearch] = useState<boolean>(false);

  // Fetch all destinations
  const fetchAllDestinations = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDestinations();
      setDestinations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Perform a basic search
  const performSearch = async (query: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setSearchQuery(query);
      const data = await searchDestinations(query);
      setDestinations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Perform an advanced search
  const performAdvancedSearch = async (params: AdvancedSearchParams): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setAdvancedSearchParams(params);
      const data = await advancedSearch(params);
      setDestinations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Toggle between basic and advanced search modes
  const toggleSearchMode = (): void => {
    setIsAdvancedSearch(!isAdvancedSearch);
  };

  // Clear any error message
  const clearError = (): void => {
    setError(null);
  };

  const addDestination = async (destination: Omit<Destination, 'id'>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await addDestinationService(destination);
      
      await fetchAllDestinations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Value object that will be passed to consumers
  const value: SearchContextState = {
    destinations,
    loading,
    error,
    searchQuery,
    advancedSearchParams,
    isAdvancedSearch,
    fetchAllDestinations,
    performSearch,
    performAdvancedSearch,
    toggleSearchMode,
    setSearchQuery,
    setAdvancedSearchParams,
    clearError,
    addDestination 
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};


export const useSearchContext = (): SearchContextState => {
  const context = useContext(SearchContext);
  
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  
  return context;
};