"use client";

import React, { useEffect, useState } from "react";
import DestinationSearchBar from "@/components/DestinationSearchBar";
import DestinationResults from "@/components/DestinationResults";
import DestinationMap from "@/components/DestinationMap";
import { SearchProvider, useSearchContext } from "@/contexts/SearchContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import LanguagePhrasesComponent from "@/components/PhrasesComponent";
import Scheduler from "@/components/TravelScheduler";
import { CycleStationsComponent } from "@/components/CycleStationsComponent";
import Navigation from "@/components/Navigation";

function HomeContent() {
  const { fetchAllDestinations, destinations, loading, error } = useSearchContext();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the component from query params
  const componentParam = searchParams.get("component");
  
  // State to track which component to show
  const [activeComponent, setActiveComponent] = useState("destinations");

  // Handle query parameter changes
  useEffect(() => {
    if (componentParam === "phrases") {
      setActiveComponent("phrases");
    } else if (componentParam === "scheduler") {
      setActiveComponent("scheduler");
    } else if (componentParam === "cycle") {
      setActiveComponent("cycle");
    } else {
      setActiveComponent("destinations");
    }
  }, [componentParam]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAllDestinations();
      } catch (e) {
        console.error("Failed to fetch initial data:", e);
      }
    };

    loadData();
  }, [fetchAllDestinations]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the appropriate component based on active state
  const renderComponent = () => {
    switch (activeComponent) {
      case "phrases":
        return <LanguagePhrasesComponent />;
      case "scheduler":
        return <Scheduler />;
      case "cycle":
        return <CycleStationsComponent />;
      case "destinations":
      default:
        return (
          <>
            {/* Navigation Section */}
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
            
            {/* Destination Search and Map Section */}
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
          </>
        );
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center bg-green-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {renderComponent()}
      
      {/* Developer Logout Button */}
      <button 
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        style={{ 
          position: "fixed", 
          bottom: "10px", 
          right: "10px",
          padding: "8px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}
      >
        DEV LOGOUT
      </button>
    </motion.div>
  );
}

export default function Home() {
  return (
    <SearchProvider>
      <Navigation/>
      <HomeContent />
    </SearchProvider>
  );
}