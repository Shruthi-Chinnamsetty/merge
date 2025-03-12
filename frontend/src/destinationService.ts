// src/destinationService.ts

import { Destination, AdvancedSearchParams } from "./types";

// Base URL for the API
const API_BASE_URL = "http://localhost:8080/api/destinations";

/**
 * Fetches all destinations from the backend API
 * @returns Promise with an array of Destination objects
 */
export const getAllDestinations = async (): Promise<Destination[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as Destination[];
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    throw error;
  }
};

/**
 * Searches destinations by a generic search term
 * @param query - Search term to find across name, country, and description
 * @returns Promise with an array of matching Destination objects
 */
export const searchDestinations = async (query: string): Promise<Destination[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as Destination[];
  } catch (error) {
    console.error(`Failed to search destinations with query '${query}':`, error);
    throw error;
  }
};

/**
 * Performs an advanced search with specific name and country criteria
 * @param params - Object containing name and country filter parameters
 * @returns Promise with an array of matching Destination objects
 */
export const advancedSearch = async (params: AdvancedSearchParams): Promise<Destination[]> => {
  try {
    // Build query string from the provided parameters
    const queryParams = new URLSearchParams();
    
    if (params.name) {
      queryParams.append("name", params.name);
    }
    
    if (params.country) {
      queryParams.append("country", params.country);
    }
    
    const response = await fetch(`${API_BASE_URL}/search/advanced?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as Destination[];
  } catch (error) {
    console.error("Failed to perform advanced search:", error);
    throw error;
  }
};

/**
 * Adds a new destination to the backend
 * @param destination - The destination object to add (without id)
 * @returns Promise with the newly created Destination (including id)
 */
export const addDestination = async (destination: Omit<Destination, 'id'>): Promise<Destination> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(destination),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as Destination;
  } catch (error) {
    console.error("Failed to add destination:", error);
    throw error;
  }
};