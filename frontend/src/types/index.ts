export interface Language {
  languageId: number;
  languageName: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface Phrase {
  phraseId: number;
  languageId: number;
  categoryId: number;
  phraseText: string;
  translation: string;
  category?: Category;
}

export interface Schedule {
  id?: number;
  destinationName: string;
  distance: number;
  category: 'Business' | 'Leisure' | 'Education' | 'Other';
  startDate: Date;
  endDate: Date;
  travelMode: 'Car' | 'Train' | 'Plane' | 'Bus';
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  userId?: number; // Optional in frontend, will be set by backend
  user?: {
      id: number;
      name: string;
      email: string;
  }; // Include user object for responses that include user details
}

export interface Destination {
    id: number;       // Unique identifier for the destination
    name: string;     // Name of the destination (e.g., "Paris")
    country: string;  // Country where the destination is located (e.g., "France")
    description: string; // Description of the destination
    latitude?: number;  // Optional latitude coordinate
    longitude?: number; // Optional longitude coordinate
}
  /**
   * Parameters for the advanced search functionality
   */
  export interface AdvancedSearchParams {
    name?: string;
    country?: string;
  }