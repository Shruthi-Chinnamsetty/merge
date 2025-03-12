"use client";

import React, { useEffect } from "react";
import DestinationSearchBar from "@/components/DestinationSearchBar";
import DestinationResults from "@/components/DestinationResults";
import DestinationMap from "@/components/DestinationMap";
import { SearchProvider, useSearchContext } from "@/contexts/SearchContext";
import { motion } from "framer-motion";

// Inner component to use context hooks
function HomeContent() {
  const { fetchAllDestinations, destinations, loading, error } = useSearchContext();
  
  // Fetch initial data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAllDestinations();
      } catch (e) {
        console.error("Failed to fetch initial data:", e);
        // Silent failure, UI will show empty state
      }
    };
    
    loadData();
    
    // Optional cleanup function
    return () => {
      // Any cleanup code here if needed
    };
  }, []); // Empty dependency array to ensure it only runs once on mount

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center bg-green-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="w-full max-w-6xl mx-auto text-center py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Pocket Map</h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto mb-6">
          Plan eco-friendly trips, discover sustainable destinations, and connect with like-minded travelers.
        </p>
        <p className="text-md text-gray-600 max-w-2xl mx-auto mb-8">
          Our platform helps you find the perfect destinations for your next adventure. 
          Use the search below to explore destinations by name or country, and discover 
          new places that match your interests.
        </p>
      </section>
      
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <DestinationSearchBar />
          <div className="mt-6">
            <DestinationResults />
          </div>
        </div>
        <div className="h-full">
          <DestinationMap />
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <SearchProvider>
      <HomeContent />
    </SearchProvider>
  );
}