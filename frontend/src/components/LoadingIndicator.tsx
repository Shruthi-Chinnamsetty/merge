// src/components/LoadingIndicator.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-16 h-16 mb-4">
        {/* Outer circle */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-green-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Spinning circle */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.2, 
            ease: "linear", 
            repeat: Infinity 
          }}
        />
      </div>
      
      <motion.p
        className="text-gray-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingIndicator;