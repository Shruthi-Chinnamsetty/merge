import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";

const App = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [route, setRoute] = useState(null);

  const fetchRoute = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/route", {
        params: { start, end },
      });
      setRoute(response.data.paths[0].points.coordinates);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Travel Route Planner</h2>
      <input
        type="text"
        placeholder="Start Location (lat,lon)"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        type="text"
        placeholder="End Location (lat,lon)"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      <button onClick={fetchRoute}>Get Route</button>

      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {route && (
          <>
            <Marker position={route[0]}>
              <Popup>Start Point</Popup>
            </Marker>
            <Marker position={route[route.length - 1]}>
              <Popup>End Point</Popup>
            </Marker>
            <Polyline positions={route} color="blue" />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default App;