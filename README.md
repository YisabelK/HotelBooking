# The Han Hotels & Resorts 🏨

A full-stack hotel booking application that enables room reservations and management.

## Key Features 🌟

### Home

#### Homepage<br/>

![Homepage](https://github.com/user-attachments/assets/ecaa3387-50dc-4b3d-8ea4-8a8f841a5037)

#### About The Han Page<br/>

![AboutTheHan](https://github.com/user-attachments/assets/8d7cf098-c45d-4a7f-b89a-1493c0a2ed4c)

### Users

#### Search and book rooms<br/>

![SearchBooking](https://github.com/user-attachments/assets/10ba33d8-ebf5-422c-98c7-c43b9ee618e3)
![Reservation](https://github.com/user-attachments/assets/bd194f7e-d180-4591-8c7f-8b421e937a7d)

#### Register/Login<br/>

![Register](https://github.com/user-attachments/assets/3227a624-4a04-4269-aab8-4d289636bde9)
![Login](https://github.com/user-attachments/assets/09c11010-7033-4610-977f-9621cd16757b)

#### Profile management<br/>

![ProfilePage](https://github.com/user-attachments/assets/9a366bb2-bb6a-4b5c-9f04-c06ac95ea591)

### Rooms

#### Hotel Room Browsing & Search<br/>

![Room](https://github.com/user-attachments/assets/8568ee51-918e-4c6a-825e-d0769e29d5f5)

### Admin

#### Room management (CRUD)<br/>

![AdminAddRoom](https://github.com/user-attachments/assets/e93836cb-ec0c-4ec9-9567-72ced7d693c2)
![AdminEditRoom](https://github.com/user-attachments/assets/0ac80ad3-29d3-486a-aaab-24734bdf74c6)

#### Booking management<br/>

![AdminManageBooking](https://github.com/user-attachments/assets/a09c7da4-2cf4-48bb-9018-13851ca73080)

#### User management<br/>

![AdminManageUser](https://github.com/user-attachments/assets/9a366bb2-bb6a-4b5c-9f04-c06ac95ea591)

## Tech Stack 💻

### Backend

- Java 17
- Spring Boot 3.4.0
- Spring Security
- Spring Data JPA
- MySQL
- JWT Authentication
- AWS S3 (Image Storage)
- Swagger (API Documentation)

### Frontend

- React 18
- React Router DOM
- Material-UI
- Axios
- CSS3

### Deployment

- Backend: AWS

## API Documentation 📚

API documentation is available through Swagger UI: http://localhost:4040/swagger-ui.html

## Setup ⚙️

1. Backend Setup

- cd backend
- cp src/main/resources/application.properties.example src/main/resources/application.properties
- Configure DB and AWS settings in application.properties
- ./mvnw spring-boot:run

2. Frontend Setup

- cd frontend
- npm install
- npm start

## Ports 🚪

- Frontend: http://localhost:3000
- Backend: http://localhost:4040

## Features 🎯

### Room Management

- View available rooms
- Filter by room type
- Room details with photos
- Real-time availability checking

### Booking System

- Date selection
- Instant booking confirmation
- Booking management
- Email notifications

### User Features

- Secure authentication
- Profile management
- Booking history
- Personal preferences

### Admin Dashboard

- Room inventory management
- Booking overview
- User management
- Analytics and reports

## Todo

- [ ] Implement email functionality
- [ ] Implement send message to user in admin dashboard
- [ ] Implement achievement system
- [ ] Implement payment system
- [ ] Implement review system
- [ ] Implement chat system
- [ ] Implement AI assistant

## Contact 📧

- Email: isabelyumi37@gmail.com
- LinkedIn: [Yoomi Isabel Kim](https://www.linkedin.com/in/yoomi-isabel-kim-4855572b7/)
- GitHub: [YisabelK](https://github.com/YisabelK)
