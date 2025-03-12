// src/components/DestinationResults.tsx
"use client";

import React from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { motion, AnimatePresence } from "framer-motion";

const DestinationResults = () => {
  const { destinations, loading, error, searchQuery, isAdvancedSearch, advancedSearchParams } = useSearchContext();

  // Function to determine what message to show when no results are found
  const getNoResultsMessage = () => {
    if (isAdvancedSearch) {
      const name = advancedSearchParams.name || '';
      const country = advancedSearchParams.country || '';
      if (name && country) {
        return `No destinations found matching "${name}" in "${country}"`;
      } else if (name) {
        return `No destinations found with name containing "${name}"`;
      } else if (country) {
        return `No destinations found in "${country}"`;
      }
    } else if (searchQuery) {
      return `No destinations found matching "${searchQuery}"`;
    }
    
    return "No destinations found. Try a different search.";
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="w-full py-10 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-4 border-green-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading destinations...</p>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="w-full py-6 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // If no destinations found, show message
  if (destinations.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-gray-500">{getNoResultsMessage()}</p>
      </div>
    );
  }

  // Render destinations grid
  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {destinations.length} {destinations.length === 1 ? 'Destination' : 'Destinations'} Found
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id ? destination.id.toString() : `destination-${destination.name}-${destination.country}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{destination.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{destination.country}</p>
                <p className="text-gray-700">{destination.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DestinationResults;