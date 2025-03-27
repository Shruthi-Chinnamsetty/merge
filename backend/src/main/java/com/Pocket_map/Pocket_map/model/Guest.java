package com.Pocket_map.Pocket_map.model;

import jakarta.persistence.*;

@Entity
@Table(name = "guest")
public class Guest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "guest_name")
    private String guestName;

    @Column(name = "password")
    private String password;

    // Default constructor
    public Guest() {}

    // Constructor with fields
    public Guest(String email, String guestName, String password) {
        this.email = email;
        this.guestName = guestName;
        this.password = password;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "Guest{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", guestName='" + guestName + '\'' +
                ", password='[PROTECTED]'" +
                '}';
    }
}