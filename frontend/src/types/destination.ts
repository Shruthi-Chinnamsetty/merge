/**
 * Interface representing a destination retrieved from the backend API
 */
export interface Destination {
    id: number;       // Unique identifier for the destination
    name: string;     // Name of the destination (e.g., "Paris")
    country: string;  // Country where the destination is located (e.g., "France")
    description: string; // Description of the destination
  }
  
  /**
   * Parameters for the advanced search functionality
   */
  export interface AdvancedSearchParams {
    name?: string;
    country?: string;
  }