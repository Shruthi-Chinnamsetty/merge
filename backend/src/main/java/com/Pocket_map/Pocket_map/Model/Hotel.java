package com.Pocket_map.Pocket_map.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name = "hotel")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "total_rooms")
    private int totalRooms;

    @Column(name = "rating")
    private double rating;  // <-- Add this field

    public Hotel() {}

    public Hotel(String name, String location, int totalRooms, double rating) {
        this.name = name;
        this.location = location;
        this.totalRooms = totalRooms;
        this.rating = rating; // <-- Set rating in constructor
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(int totalRooms) {
        this.totalRooms = totalRooms;
    }

    public double getRating() {   // <-- Add this getter
        return rating;
    }

    public void setRating(double rating) {  // <-- Add this setter
        this.rating = rating;
    }

    @Override
    public String toString() {
        return "Hotel{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", totalRooms=" + totalRooms +
                ", rating=" + rating +   // <-- Include rating in toString()
                '}';
    }
}
