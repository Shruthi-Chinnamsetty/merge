"use client";

import React from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";



const DestinationSearchBar = () => {
  const [location, setLocation] = React.useState("");

  const handleSearch = () => {
    console.log("Searching for:", location);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-lg">
      <h1 className="text-xl font-semibold">Find Your Next Destination</h1>
      <Input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter a destination..."
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default DestinationSearchBar;
