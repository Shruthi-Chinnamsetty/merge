package com.Pocket_map.Pocket_map.service;

import com.Pocket_map.Pocket_map.model.CycleStation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

@Service
public class CycleStationService {

    private final RestTemplate restTemplate;

    @Autowired
    public CycleStationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<CycleStation> getNearbyStations(double lat, double lng, double radius) {
        // Get all networks from CityBikes API
        String networksUrl = "https://api.citybik.es/v2/networks";
        String networksJson = restTemplate.getForObject(networksUrl, String.class);
        
        JSONObject networksResponse = new JSONObject(networksJson);
        JSONArray networks = networksResponse.getJSONArray("networks");
        
        // Find the closest network to user location
        String closestNetworkId = findClosestNetwork(networks, lat, lng);
        
        if (closestNetworkId == null) {
            return new ArrayList<>();
        }
        
        // Get stations for the closest network
        String stationsUrl = "https://api.citybik.es/v2/networks/" + closestNetworkId;
        String stationsJson = restTemplate.getForObject(stationsUrl, String.class);
        
        JSONObject stationsResponse = new JSONObject(stationsJson);
        JSONObject network = stationsResponse.getJSONObject("network");
        JSONArray stations = network.getJSONArray("stations");
        
        // Filter and convert stations
        List<CycleStation> result = new ArrayList<>();
        for (int i = 0; i < stations.length(); i++) {
            JSONObject station = stations.getJSONObject(i);
            
            double stationLat = station.getDouble("latitude");
            double stationLng = station.getDouble("longitude");
            
            // Calculate distance between user and station
            double distance = calculateDistance(lat, lng, stationLat, stationLng);
            
            // Only include stations within the radius
            if (distance <= radius) {
                CycleStation cycleStation = convertToCycleStation(station);
                cycleStation.setDistance(distance);
                result.add(cycleStation);
            }
        }
        
        return result;
    }
    
    private String findClosestNetwork(JSONArray networks, double lat, double lng) {
        String closestId = null;
        double minDistance = Double.MAX_VALUE;
        
        for (int i = 0; i < networks.length(); i++) {
            JSONObject network = networks.getJSONObject(i);
            JSONObject location = network.getJSONObject("location");
            
            double networkLat = location.getDouble("latitude");
            double networkLng = location.getDouble("longitude");
            
            double distance = calculateDistance(lat, lng, networkLat, networkLng);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestId = network.getString("id");
            }
        }
        
        return closestId;
    }
    
    private CycleStation convertToCycleStation(JSONObject stationJson) {
        CycleStation station = new CycleStation();
        
        station.setId(stationJson.getString("id"));
        station.setName(stationJson.getString("name"));
        station.setLatitude(stationJson.getDouble("latitude"));
        station.setLongitude(stationJson.getDouble("longitude"));
        
        // Some fields might be missing in some networks
        station.setFree_bikes(stationJson.optInt("free_bikes", 0));
        station.setEmpty_slots(stationJson.optInt("empty_slots", 0));
        
        // Address might not be available for all stations
        if (stationJson.has("extra") && !stationJson.isNull("extra")) {
            JSONObject extra = stationJson.getJSONObject("extra");
            if (extra.has("address") && !extra.isNull("address")) {
                station.setAddress(extra.getString("address"));
            }
        }
        
        return station;
    }
    
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula to calculate distance between two points on Earth
        final int R = 6371000; // Earth radius in meters
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; // Distance in meters
    }
}