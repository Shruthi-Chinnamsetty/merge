/**
 * Interface representing a destination retrieved from the backend API
 */
/**
 * Interface representing a destination retrieved from the backend API
 */
export interface Destination {
    id: number;
    name: string;
    country: string;
    description: string;
    latitude?: number;
    longitude?: number;
}
  /**
   * Parameters for the advanced search functionality
   */
  export interface AdvancedSearchParams {
    name?: string;
    country?: string;
  }