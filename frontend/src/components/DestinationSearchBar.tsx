"use client";

import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useSearchContext } from "../contexts/SearchContext";
import { motion, AnimatePresence } from "framer-motion";
import { AdvancedSearchParams } from "../types";

const DestinationSearchBar = () => {
  const {
    searchQuery,
    advancedSearchParams,
    isAdvancedSearch,
    loading,
    error,
    performSearch,
    performAdvancedSearch,
    toggleSearchMode,
    clearError
  } = useSearchContext();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [localAdvancedParams, setLocalAdvancedParams] = useState<AdvancedSearchParams>(advancedSearchParams);

  const handleBasicSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      performSearch(localQuery);
    }
  };

  const handleAdvancedSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performAdvancedSearch(localAdvancedParams);
  };

  const updateAdvancedParam = (key: keyof AdvancedSearchParams, value: string) => {
    setLocalAdvancedParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-lg w-full max-w-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Find Your Next Destination</h1>
        <Button 
          onClick={toggleSearchMode}
          className="text-sm bg-transparent text-gray-700 hover:bg-gray-100"
        >
          {isAdvancedSearch ? "Simple Search" : "Advanced Search"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="absolute top-0 right-0 px-2 py-1"
          >
            ×
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isAdvancedSearch ? (
          <motion.form 
            key="advanced"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleAdvancedSearch}
            className="flex flex-col gap-3"
          >
            <Input
              value={localAdvancedParams.name || ""}
              onChange={(e) => updateAdvancedParam("name", e.target.value)}
              placeholder="Destination name..."
              className="border-gray-300"
            />
            <Input
              value={localAdvancedParams.country || ""}
              onChange={(e) => updateAdvancedParam("country", e.target.value)}
              placeholder="Country..."
              className="border-gray-300"
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </motion.form>
        ) : (
          <motion.form 
            key="basic"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleBasicSearch}
            className="flex flex-col gap-3"
          >
            <Input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Enter a destination..."
              className="border-gray-300"
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DestinationSearchBar;