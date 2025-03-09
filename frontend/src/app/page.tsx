"use client";

import React, { useEffect } from "react";
import DestinationSearchBar from "@/components/DestinationSearchBar";
import DestinationResults from "@/components/DestinationResults";
import { SearchProvider } from "@/contexts/SearchContext";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <SearchProvider>
      <motion.div
        className="min-h-screen flex flex-col items-center bg-green-100 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <section className="w-full max-w-4xl mx-auto text-center py-10">
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
        
        <section className="w-full max-w-4xl mx-auto mb-8">
          <DestinationSearchBar />
        </section>
        
        <section className="w-full max-w-4xl mx-auto">
          <DestinationResults />
        </section>
      </motion.div>
    </SearchProvider>
  );
}