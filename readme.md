# StayEase – Hotel Booking Application

StayEase is a full-stack hotel booking web application built using the MERN stack. It allows users to explore hotels, view available rooms, make reservations, and simulate payments. Hotel owners can manage their properties, add rooms, and monitor customer bookings through an owner dashboard.

## Features

### User Features
- User registration and login.
- Browse available hotels and rooms.
- View hotel and room details.
- Book rooms with check-in and check-out dates.
- Check room availability.
- View personal booking history.
- View booking and payment status.
- Simulate successful and failed payments.

### Hotel Owner Features
- Owner authentication.
- Register and manage hotels.
- Add rooms with images and details.
- View rooms associated with their hotels.
- View customer bookings.
- Monitor booking and payment status.

### Payment System
- Development-only mock payment integration.
- Simulate successful payments.
- Simulate failed payments.
- Update booking and payment status.
- No real money is charged.

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS 4
- Axios
- Lucide React
- React Hot Toast
- Motion

### Backend
- Node.js
- Express.js 5
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js
- Cookie Parser
- Multer
- Nodemailer
- CORS

## Project Structure

```text
StayEase/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── Components/
│   │   ├── Context/
│   │   ├── Pages/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── main.js
│   └── package.json
│
└── README.md
```

## Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd StayEase
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

Configure the environment variables required by your backend:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
MOCK_PAYMENTS_ENABLED=true
```

Use the exact environment variable names expected by your backend configuration.

Start the backend development server:

```bash
npm run server
```

The backend will run on the configured port.

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev
```

Open the local URL provided by Vite, usually:

```text
http://localhost:5173
```

## Available Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production frontend |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

### Backend

| Command | Description |
|---|---|
| `npm run server` | Start backend using Nodemon |
| `npm start` | Start backend using Node.js |

## Payment Disclaimer

StayEase currently uses a simulated payment system for development and testing purposes.

- No actual financial transactions take place.
- Payment success and failure are simulated.
- The application does not currently integrate Stripe or another real payment gateway.

## Future Improvements

- Real payment gateway integration.
- Booking cancellation and management.
- Improved room availability management.
- Advanced hotel search and filtering.
- Enhanced dashboard analytics.
- Production deployment.

## Author

**Developed as a Full-Stack MERN Project.**

