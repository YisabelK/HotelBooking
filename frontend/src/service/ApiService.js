import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4040";

/**
 * if the token is expired, it will refresh the token
 */
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh-token") ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.statusCode === 200) {
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(
          new Error("Session expired. Please login again.")
        );
      }
    }

    return Promise.reject(error);
  }
);

/**
 * ApiService class
 */
export default class ApiService {
  static BASE_URL = API_BASE_URL;

  static getHeader() {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /**USER */
  /* This  register a new user */
  static async registerUser(registration) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/register`,
      registration,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  }

  /* This  login a registered user */
  static async loginUser(loginDetails) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/auth/login`,
        loginDetails
      );

      if (response.data.statusCode === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("role", response.data.role);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /*  This is  to get the user profile */
  static async getAllUsers() {
    const response = await axios.get(`${this.BASE_URL}/users/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getUserProfile() {
    const response = await axios.get(
      `${this.BASE_URL}/users/get-logged-in-profile-info`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getUser(userId) {
    const response = await axios.get(
      `${this.BASE_URL}/users/get-by-id/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This is the  to get user bookings by the user id */
  static async getUserBookings(userId) {
    const response = await axios.get(
      `${this.BASE_URL}/users/get-user-bookings/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This is to delete a user */
  static async deleteUser(userId) {
    const response = await axios.delete(
      `${this.BASE_URL}/users/delete/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /**ROOM */
  /* This  adds a new room room to the database */
  static async addRoom(formData) {
    const result = await axios.post(`${this.BASE_URL}/rooms/add`, formData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  /* This  gets all availavle rooms */
  static async getAllAvailableRooms() {
    const result = await axios.get(
      `${this.BASE_URL}/rooms/all-available-rooms`
    );
    return result.data;
  }

  /* This  gets all availavle by dates rooms from the database with a given date and a room type */
  static async getAvailableRoomsByDateAndType(
    checkInDate,
    checkOutDate,
    roomType
  ) {
    const result = await axios.get(
      `${this.BASE_URL}/rooms/available-rooms-by-date-and-type?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}`
    );
    return result.data;
  }

  /* This  gets all room types from thee database */
  static async getRoomTypes() {
    const response = await axios.get(`${this.BASE_URL}/rooms/types`);
    return response.data;
  }
  /* This  gets all rooms from the database */
  static async getAllRooms() {
    const result = await axios.get(`${this.BASE_URL}/rooms/all`);
    return result.data;
  }
  /* This funcction gets a room by the id */
  static async getRoomById(roomId) {
    const result = await axios.get(
      `${this.BASE_URL}/rooms/room-by-id/${roomId}`
    );
    return result.data;
  }

  /* This  deletes a room by the Id */
  static async deleteRoom(roomId) {
    const result = await axios.delete(
      `${this.BASE_URL}/rooms/delete/${roomId}`,
      {
        headers: this.getHeader(),
      }
    );
    return result.data;
  }

  /* This updates a room */
  static async updateRoom(roomId, formData) {
    const result = await axios.put(
      `${this.BASE_URL}/rooms/update/${roomId}`,
      formData,
      {
        headers: {
          ...this.getHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return result.data;
  }

  /**BOOKING */
  /* This  saves a new booking to the databse */
  static async bookRoom(roomId, userId, booking) {
    console.log("USER ID IS: " + userId);

    const response = await axios.post(
      `${this.BASE_URL}/bookings/book-room/${roomId}/${userId}`,
      booking,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This  gets alll bokings from the database */
  static async getAllBookings() {
    const result = await axios.get(`${this.BASE_URL}/bookings/all`, {
      headers: this.getHeader(),
    });
    return result.data;
  }

  /* This  get booking by the cnfirmation code */
  static async getBookingByConfirmationCode(bookingCode) {
    const result = await axios.get(
      `${this.BASE_URL}/bookings/get-by-confirmation-code/${bookingCode}`
    );
    return result.data;
  }

  /* This is the  to cancel user booking */
  static async cancelBooking(bookingId) {
    const result = await axios.delete(
      `${this.BASE_URL}/bookings/cancel/${bookingId}`,
      {
        headers: this.getHeader(),
      }
    );
    return result.data;
  }

  /**AUTHENTICATION CHECKER */
  static logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
  }

  static isAuthenticated() {
    const token = localStorage.getItem("accessToken");
    return !!token;
  }

  static isAdmin() {
    const role = localStorage.getItem("role");
    return role === "ADMIN";
  }

  static isUser() {
    const role = localStorage.getItem("role");
    return role === "USER";
  }

  static async updateProfile(updateData) {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Token being used:", token);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await axios.put(`${this.BASE_URL}/users/update-profile`, updateData, {
        headers,
      });

      const updatedProfileResponse = await this.getUserProfile();
      return updatedProfileResponse.user;
    } catch (error) {
      console.error("Update profile error:", error.response || error);
      throw error;
    }
  }
}
