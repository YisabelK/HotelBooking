package com.hotelbooking.HotelBooking.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.io.Serializable;
import java.io.IOException;

@Data
@Entity
@Table(name = "rooms")
public class Room implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoomType roomType;
    @Column(precision = 10, scale = 2)
    private BigDecimal roomPrice;
    private String roomPhotoUrl;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String roomDescription;
    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference(value = "room-bookings")
    private List<Booking> bookings = new ArrayList<>();

    private int maxOccupancy;

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

    private void writeObject(java.io.ObjectOutputStream out) throws IOException {
        out.defaultWriteObject();
        out.writeObject(id);
        out.writeObject(roomType);
        out.writeObject(roomPrice);
        out.writeObject(roomPhotoUrl);
        out.writeObject(roomDescription);
        out.writeObject(maxOccupancy);
    }

    private void readObject(java.io.ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject();
        id = (Long) in.readObject();
        roomType = (RoomType) in.readObject();
        roomPrice = (BigDecimal) in.readObject();
        roomPhotoUrl = (String) in.readObject();
        roomDescription = (String) in.readObject();
        maxOccupancy = (Integer) in.readObject();
    }
}
