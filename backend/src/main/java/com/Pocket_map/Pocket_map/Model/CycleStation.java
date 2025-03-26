package com.Pocket_map.Pocket_map.model;

public class CycleStation {
    private String id;
    private String name;
    private double latitude;
    private double longitude;
    private int free_bikes;
    private int empty_slots;
    private String address;
    private double distance;  // in meters

    // Default constructor
    public CycleStation() {
    }

    // Constructor with all fields
    public CycleStation(String id, String name, double latitude, double longitude, 
                        int free_bikes, int empty_slots, String address, double distance) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.free_bikes = free_bikes;
        this.empty_slots = empty_slots;
        this.address = address;
        this.distance = distance;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public int getFree_bikes() {
        return free_bikes;
    }

    public void setFree_bikes(int free_bikes) {
        this.free_bikes = free_bikes;
    }

    public int getEmpty_slots() {
        return empty_slots;
    }

    public void setEmpty_slots(int empty_slots) {
        this.empty_slots = empty_slots;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }
}