// src/components/DestinationMap.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { Destination } from "../types";
import dynamic from 'next/dynamic';

// Augment the Destination type locally
interface DestinationWithCoords extends Destination {
  latitude?: number;
  longitude?: number;
}

// Default coordinates for map center when no destinations are selected
const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522]; // Paris coordinates
const DEFAULT_ZOOM = 5;

// Sample coordinates for demo purposes as fallback
const coordinatesMap: Record<string, [number, number]> = {
  "Paris": [48.8566, 2.3522],
  "London": [51.5074, -0.1278],
  "Rome": [41.9028, 12.4964],
  "Barcelona": [41.3851, 2.1734],
  "Amsterdam": [52.3676, 4.9041],
  "Berlin": [52.5200, 13.4050],
  "Prague": [50.0755, 14.4378],
  "Vienna": [48.2082, 16.3738]
};

// Create a map component that will only be loaded on the client side
const MapComponent = () => {
  const { destinations } = useSearchContext();
  const mapRef = useRef<HTMLDivElement>(null);
  const [leaflet, setLeaflet] = useState<any>(null);
  const leafletMap = useRef<any>(null);
  const markersLayer = useRef<any>(null);

  // Only import Leaflet on the client side
  useEffect(() => {
    import('leaflet').then(L => {
      setLeaflet(L);
    });
  }, []);

  // Load Leaflet CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Clean up function
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !leaflet) return;
    
    // Initialize map if not already initialized
    if (!leafletMap.current) {
      leafletMap.current = leaflet.map(mapRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      
      // Add OpenStreetMap tiles
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMap.current);
      
      // Initialize markers layer
      markersLayer.current = leaflet.layerGroup().addTo(leafletMap.current);
    }
    
    // Return cleanup function
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [leaflet]);

  // Update markers when destinations change
  useEffect(() => {
    if (!leafletMap.current || !markersLayer.current || !leaflet) return;
    
    // Clear existing markers
    markersLayer.current.clearLayers();
    
    // If no destinations, return to default view
    if (destinations.length === 0) {
      leafletMap.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }
    
    // Add markers for each destination
    const bounds = leaflet.latLngBounds([]);
    let markersAdded = 0;
    
    destinations.forEach((destination) => {
      // Cast to our augmented type to avoid TypeScript errors
      const dest = destination as DestinationWithCoords;
      
      // Check if the destination has coordinates directly
      if (dest.latitude && dest.longitude) {
        const coords: [number, number] = [dest.latitude, dest.longitude];
        addMarker(coords, destination);
        bounds.extend(coords);
        markersAdded++;
      } 
      // Fall back to the hardcoded coordinates if needed
      else if (coordinatesMap[destination.name]) {
        const coords = coordinatesMap[destination.name];
        addMarker(coords, destination);
        bounds.extend(coords);
        markersAdded++;
      }
    });
    
    // Adjust map view to show all markers
    if (bounds.isValid() && markersAdded > 0) {
      leafletMap.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      leafletMap.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }, [destinations, leaflet]);

  // Helper function to add a marker
  const addMarker = (coords: [number, number], destination: Destination) => {
    const marker = leaflet.marker(coords)
      .bindPopup(`
        <strong>${destination.name}</strong><br>
        ${destination.country}<br>
        <em>${destination.description}</em>
      `);
    
    marker.addTo(markersLayer.current);
  };

  return <div ref={mapRef} className="h-96" />;
};

// Main component with client-side only rendering
const DestinationMap: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden ">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Interactive Map</h3>
      </div>
      <MapComponent />
    </div>
  );
};

export default DestinationMap;