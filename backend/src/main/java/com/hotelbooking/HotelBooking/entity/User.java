package com.hotelbooking.HotelBooking.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Entity 
@Table(name = "users")
public class User implements UserDetails, Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Phone Number is required")
    private String phoneNumber;
    @NotBlank(message = "Password is required")
    private String password;
    @NotBlank(message = "Password confirmation is required", groups = IValidationGroups.Registration.class)
    @Transient
    private String passwordConfirm;
    private String role;
    @NotBlank(message = "Address is required")
    private String streetName;
    @NotBlank(message = "House Number is required")
    private String houseNumber;
    @NotBlank(message = "Postal Code is required")
    private String postalCode;
    @NotBlank(message = "City is required")
    private String city;
    private String state;
    @NotBlank(message = "Country is required")
    private String country;
    @NotNull(message = "Birth Date is required")
    private LocalDate birthDate;
    private String gender;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "user-bookings")
    private List<Booking> bookings = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getUsername() {
        return email;
    }
    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    private void writeObject(java.io.ObjectOutputStream out) throws IOException {
        out.defaultWriteObject();
        out.writeObject(id);
        out.writeObject(email);
        out.writeObject(name);
        out.writeObject(phoneNumber);
        out.writeObject(role);
        out.writeObject(birthDate);
        out.writeObject(gender);
    }

    private void readObject(java.io.ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject();
        id = (Long) in.readObject();
        email = (String) in.readObject();
        name = (String) in.readObject();
        phoneNumber = (String) in.readObject();
        role = (String) in.readObject();
        birthDate = (LocalDate) in.readObject();
        gender = (String) in.readObject();
    }
}
