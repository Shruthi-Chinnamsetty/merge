// src/components/DestinationResults.tsx
"use client";

import React from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
          <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading destinations...</p>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="w-full py-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // If no destinations found, show message
  if (destinations.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-muted-foreground">{getNoResultsMessage()}</p>
      </div>
    );
  }

  // Render destinations grid
  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold mb-6">
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
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <CardTitle className="text-xl mb-1">{destination.name}</CardTitle>
                  <CardDescription className="mb-3">{destination.country}</CardDescription>
                  <p className="text-card-foreground">{destination.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DestinationResults;