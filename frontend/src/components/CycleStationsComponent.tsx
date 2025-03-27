"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Types for our data
interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  free_bikes: number;
  empty_slots: number;
  address?: string;
  distance?: number; // in meters
}

export function CycleStationsComponent() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(0); // For forcing map to re-render when location changes

  // Get user's current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          if (err.code !== 1) { // 1 = PERMISSION_DENIED
            setError("Error getting location: " + err.message);
          }
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  // Function to fetch stations from our backend API
  const fetchNearbyStations = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update to use the absolute URL with the correct port
      const response = await axios.get(`http://localhost:8080/api/cycle-stations/nearby?lat=${lat}&lng=${lng}`);
      
      if (response.data && Array.isArray(response.data)) {
        setStations(response.data);
        // If no stations found, show a user-friendly message
        if (response.data.length === 0) {
          setError("No cycle stations found in this area. Try a different location.");
        }
      } else {
        setError("Invalid response format from server");
      }
    } catch (err: any) {
      // More descriptive error message
      if (err.response) {
        // The request was made and the server responded with a status code
        setError(`Server error: ${err.response.status} - ${err.response.data?.message || "Unknown error"}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError("Could not reach the server. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request
        setError(`Error: ${err.message}`);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle location search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchLocation.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use a geocoding service to convert address to coordinates
      const geocodeResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}`
      );
      
      if (geocodeResponse.data && geocodeResponse.data.length > 0) {
        const location = {
          lat: parseFloat(geocodeResponse.data[0].lat),
          lng: parseFloat(geocodeResponse.data[0].lon)
        };
        
        setUserLocation(location);
        setMapKey(prev => prev + 1); // Force map to re-render with new center
        await fetchNearbyStations(location.lat, location.lng);
      } else {
        setError("Location not found. Please try a different search term.");
      }
    } catch (err) {
      setError("Error searching for location. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Use current location
  const useCurrentLocation = async () => {
    if (userLocation) {
      await fetchNearbyStations(userLocation.lat, userLocation.lng);
    } else {
      // Try to get location again if not available
      if (navigator.geolocation) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            setMapKey(prev => prev + 1);
            await fetchNearbyStations(location.lat, location.lng);
            setLoading(false);
          },
          (err) => {
            setError("Error getting location: " + err.message);
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by your browser");
      }
    }
  };

  // Fix for Leaflet marker icons in Next.js
  useEffect(() => {
    // Create a custom icon instead of modifying the prototype
    const defaultIcon = new L.Icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Create a bike station icon (different color)
    const bikeIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Set as default for all markers
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  return (
    <div className="container mx-auto p-4 bg-amber-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-emerald-800">Find Nearby Cycle Stations</h1>
      
      <form onSubmit={handleSearch} className="mb-6 flex shadow-md rounded-lg overflow-hidden">
        <input
          type="text"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          placeholder="Enter a location (city, address, etc.)"
          className="flex-grow p-3 border-0 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
        />
        <button 
          type="submit" 
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 font-medium transition-colors"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      <button 
        onClick={useCurrentLocation} 
        className="mb-6 bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-lg shadow-md transition-colors w-full md:w-auto font-medium flex items-center justify-center"
        disabled={loading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        {loading ? 'Loading...' : 'Use My Current Location'}
      </button>
      
      {error && (
        <div className="text-red-600 mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md shadow-sm">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="text-gray-600 mb-6 p-4 bg-gray-100 rounded-md shadow-sm flex items-center">
          <svg className="animate-spin h-5 w-5 mr-3 text-emerald-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading cycle stations...
        </div>
      )}
      
      {userLocation && (
        <div className="h-96 mb-6 rounded-lg overflow-hidden shadow-lg">
          {/* Key prop forces re-render when location changes */}
          <MapContainer 
            key={mapKey}
            center={[userLocation.lat, userLocation.lng]} 
            zoom={14} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User location marker */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div className="font-medium">Your location</div>
              </Popup>
            </Marker>
            
            {/* Station markers */}
            {stations.map((station) => (
              <Marker 
                key={station.id} 
                position={[station.latitude, station.longitude]}
              >
                <Popup>
                  <div className="max-w-xs">
                    <h3 className="font-bold text-lg border-b pb-1 mb-2">{station.name}</h3>
                    {station.address && <p className="mb-2 text-gray-600">{station.address}</p>}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="bg-emerald-50 p-2 rounded text-center">
                        <div className="font-bold text-emerald-600">{station.free_bikes}</div>
                        <div className="text-sm">Available bikes</div>
                      </div>
                      <div className="bg-amber-50 p-2 rounded text-center">
                        <div className="font-bold text-amber-600">{station.empty_slots}</div>
                        <div className="text-sm">Empty slots</div>
                      </div>
                    </div>
                    {station.distance && (
                      <p className="text-sm text-gray-500 mt-2">
                        Distance: {(station.distance / 1000).toFixed(2)} km
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
      
      {/* List of stations */}
      {stations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b border-amber-200 pb-2 text-emerald-800">Nearby Stations ({stations.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stations.map((station) => (
              <div key={station.id} className="border border-amber-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white">
                <div className="bg-emerald-800 text-white p-3">
                  <h3 className="font-bold text-lg truncate">{station.name}</h3>
                  <p className="text-gray-300 text-sm">{station.id}</p>
                </div>
                
                <div className="p-4">
                  {station.address && <p className="text-gray-600 mb-3 italic">{station.address}</p>}
                  
                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                      <div className="font-bold text-emerald-600 text-2xl text-center">{station.free_bikes}</div>
                      <div className="text-sm text-center text-emerald-800">Available Bikes</div>
                    </div>
                    <div className="flex-1 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <div className="font-bold text-amber-600 text-2xl text-center">{station.empty_slots}</div>
                      <div className="text-sm text-center text-amber-800">Empty Slots</div>
                    </div>
                  </div>
                  
                  {station.distance && (
                    <div className="flex items-center text-gray-500 mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">Distance: {(station.distance / 1000).toFixed(2)} km</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}