package com.hotelbooking.HotelBooking.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.io.Serializable;
import java.io.IOException;

@Data
@Entity
@Table(name = "bookings")
public class Booking implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull( message = "Check in data is required")
    private LocalDate checkInDate;

    @Future( message = "Check out data must be in the future")
    private LocalDate checkOutDate;

    @Min(value = 1, message = "Number of adults  must not be less than 1")
    private int numOfAdults;

    @Min(value = 0, message = "Number of adults  must not be less than 0")
    private int numOfChildren;

    private int totalNumOfGuest;
    private String bookingConfirmationCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "user-bookings")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @JsonBackReference(value = "room-bookings")
    private Room room;

    private BookingStatus status;

    public void calculateTotalNumberOfGuest() {
        this.totalNumOfGuest = this.numOfAdults + this.numOfChildren;
    }

    public void setNumOfAdults(int numOfAdults) {
        this.numOfAdults = numOfAdults;
        calculateTotalNumberOfGuest();
    }

    public void setNumOfChildren(int numOfChildren) {
        this.numOfChildren = numOfChildren;
        calculateTotalNumberOfGuest();
    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", checkInDate=" + checkInDate +
                ", checkOutData=" + checkOutDate +
                ", numOfAdults=" + numOfAdults +
                ", numOfChildren=" + numOfChildren +
                ", totalNumOfGuest=" + totalNumOfGuest +
                ", bookingConfirmationCode='" + bookingConfirmationCode + '\'' +
                '}';
    }

    private void writeObject(java.io.ObjectOutputStream out) throws IOException {
        out.defaultWriteObject();
        out.writeObject(id);
        out.writeObject(checkInDate);
        out.writeObject(checkOutDate);
        out.writeObject(numOfAdults);
        out.writeObject(numOfChildren);
        out.writeObject(totalNumOfGuest);
        out.writeObject(bookingConfirmationCode);
        out.writeObject(status);
    }

    private void readObject(java.io.ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject();
        id = (Long) in.readObject();
        checkInDate = (LocalDate) in.readObject();
        checkOutDate = (LocalDate) in.readObject();
        numOfAdults = (Integer) in.readObject();
        numOfChildren = (Integer) in.readObject();
        totalNumOfGuest = (Integer) in.readObject();
        bookingConfirmationCode = (String) in.readObject();
        status = (BookingStatus) in.readObject();
    }
}
