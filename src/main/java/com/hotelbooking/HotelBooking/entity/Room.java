package com.hotelbooking.HotelBooking.entity;

import jakarta.persistence.*;
import lombok.Data;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomType;
    @Column(precision = 10, scale = 2)
    private BigDecimal roomPrice;
    private String roomPhotoUrl;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String roomDescription;
    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", roomType='" + roomType + '\'' +
                ", roomPrice='" + roomPrice + '\'' +
                ", roomPhotoUrl='" + roomPhotoUrl + '\'' +
                ", roomDescription='" + roomDescription + '\'' +
                '}';
    }
}
