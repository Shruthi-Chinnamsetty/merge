package com.Pocket_map.Pocket_map.model;

import java.time.LocalDateTime;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "schedules")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "destination_name", nullable = false)
    private String destinationName;
    
    @Column(nullable = false)
    private Double distance;
    
    @Column(nullable = false)
    private String category;
    
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;
    
    @Column(name = "travel_mode", nullable = false)
    private String travelMode;
    
    @Column(nullable = false)
    private String status;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Default constructor required by JPA
    public Schedule() {
    }

    // Full constructor
    public Schedule(Long id, String destinationName, Double distance, String category, 
                   LocalDateTime startDate, LocalDateTime endDate, String travelMode, String status) {
        this.id = id;
        this.destinationName = destinationName;
        this.distance = distance;
        this.category = category;
        this.startDate = startDate;
        this.endDate = endDate;
        this.travelMode = travelMode;
        this.status = status;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getTravelMode() {
        return travelMode;
    }

    public void setTravelMode(String travelMode) {
        this.travelMode = travelMode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Schedule schedule = (Schedule) o;
        return Objects.equals(id, schedule.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Schedule{" +
                "id=" + id +
                ", destinationName='" + destinationName + '\'' +
                ", distance=" + distance +
                ", category='" + category + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", travelMode='" + travelMode + '\'' +
                ", status='" + status + '\'' +
                ", user=" + user +
                '}';
    }
}