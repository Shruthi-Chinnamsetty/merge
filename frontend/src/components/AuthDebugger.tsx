import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AuthDebugger() {
  const [authResults, setAuthResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const testEndpoints = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    const results: Record<string, any> = {};

    if (!token) {
      setError("No token found!");
      setLoading(false);
      return;
    }

    // Define endpoints to test
    const endpoints = [
      '/api/destinations',
      '/api/schedules',
      '/api/auth-test'
    ];

    // Test with fetch
    for (const endpoint of endpoints) {
      try {
        const fetchResponse = await fetch(`http://localhost:8080${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        results[`fetch_${endpoint}`] = {
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          ok: fetchResponse.ok
        };
        
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          results[`fetch_${endpoint}`].data = data;
        }
      } catch (err) {
        results[`fetch_${endpoint}`] = {
          error: err.message
        };
      }
    }

    // Test with axios
    for (const endpoint of endpoints) {
      try {
        const axiosResponse = await axios.get(`http://localhost:8080${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        results[`axios_${endpoint}`] = {
          status: axiosResponse.status,
          statusText: axiosResponse.statusText,
          data: axiosResponse.data
        };
      } catch (err) {
        results[`axios_${endpoint}`] = {
          error: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText
        };
      }
    }

    setAuthResults(results);
    setLoading(false);
  };

  useEffect(() => {
    testEndpoints();
  }, []);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Authentication Debugger</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <p>Testing endpoints...</p>
      ) : (
        <div>
          <button 
            onClick={testEndpoints}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Re-Test Endpoints
          </button>
          
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(authResults).map(([endpoint, result]) => (
              <div key={endpoint} className="border p-4 rounded">
                <h2 className="font-bold text-lg">{endpoint}</h2>
                <pre className="bg-gray-100 p-2 mt-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}