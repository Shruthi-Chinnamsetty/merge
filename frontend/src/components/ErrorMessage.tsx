// src/components/ErrorMessage.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onClear: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, onClear }) => {
  return (
    <motion.div
      className="w-full bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {/* Error icon */}
          <svg 
            className="h-5 w-5 text-red-500" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Something went wrong</h3>
          <div className="mt-1 text-sm text-red-700">
            <p>{message}</p>
          </div>
          
          <div className="mt-3 flex space-x-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded text-xs font-medium transition-colors"
              >
                Try Again
              </button>
            )}
            
            <button
              type="button"
              onClick={onClear}
              className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1.5 rounded text-xs font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
        
        <button
          className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700 focus:outline-none"
          onClick={onClear}
          aria-label="Close"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;
