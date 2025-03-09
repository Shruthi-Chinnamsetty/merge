"use client";

import React from "react";
import DestinationSearchBar from "@/components/DestinationSearchBar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Pocket Map</h1>
      <p className="text-lg text-gray-700 max-w-xl text-center mb-6">
        Plan eco-friendly trips, discover sustainable destinations, and connect with like-minded travelers.
      </p>
      
      <DestinationSearchBar />
      
      <Button className="mt-6 px-6 py-3 text-lg bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
        Start Planning Your Trip
      </Button>
    </motion.div>
  );
}
