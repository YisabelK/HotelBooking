package com.hotelbooking.HotelBooking.entity;

/*
 * The RoomType enum was implemented to automatically 
 * set the maximum occupancy (maxOccupancy) for each room type.
 */
public enum RoomType {
    SINGLE_ROOM("Single Room", 1),
    DOUBLE_ROOM("Double Room", 2),
    FAMILY_ROOM("Family Room", 4),
    PREMIUM_ROOM("Premium Room", 2);

    private final String displayName;
    private final int maxOccupancy;

    RoomType(String displayName, int maxOccupancy) {
        this.displayName = displayName;
        this.maxOccupancy = maxOccupancy;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getMaxOccupancy() {
        return maxOccupancy;
    }

    public static RoomType fromDisplayName(String displayName) {
        for (RoomType type : values()) {
            if (type.getDisplayName().equalsIgnoreCase(displayName)) {
                return type;
            }
        }
        throw new IllegalArgumentException("No room type found for display name: " + displayName);
    }
}
