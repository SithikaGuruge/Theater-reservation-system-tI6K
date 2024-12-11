# MovieMingle - Theater Management System

## Project Overview
The MovieMingle system is a web application that allows users to browse movies, select theaters, book tickets, and manage their reservations. It features user authentication, seat selection, payment integration, and an admin panel for managing movie schedules. The backend is powered by Node.js/Express, while MySQL (deployed on AWS RDS Free Tier) serves as the database.

## Features
- **User Authentication**: Users can register, log in, and manage their profiles.
- **Movie Browsing**: Browse current and upcoming movies with detailed information.
- **Theater and Showtime Selection**: View available theaters and showtimes by location.
- **Seat Reservation**: Select and reserve specific seats for a chosen showtime.
- **Payment Integration**: Make payments using Stripe for secure transactions.
- **Booking Management**: View and cancel bookings from a personal dashboard.
- **Admin Panel**: Admins can manage movies, theaters, showtimes, and bookings.

## Technologies Used
- **Frontend**: React, Material UI, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL (hosted on AWS RDS Free Tier)
- **Payment Gateway**: Stripe
- **Testing**: Jest, JMeter

## Getting Started
To clone the project and set up the development environment, follow these steps.

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- AWS CLI (for AWS RDS setup)
- Stripe Account
- Firebase Account

### Installation
1. **Clone the repository:**

    ```bash
    git clone https://github.com/ManadaHerath/Theater-reservation-system.git
    cd Theater-reservation-system
    ```

2. **Install dependencies:**

    For the **backend**:
    ```bash
    cd backend
    npm install
    nodemon
    ```

    For the **frontend**:
    ```bash
    cd frontend
    npm install
    ```

3. **Start the server:**

    ```bash
    cd frontend
    npm start
    ```

    ```bash
    cd backend
    npm start
    ```

## Contributors
- Sithika Guruge
- Manada Herath
- Pramod Hasaranga
