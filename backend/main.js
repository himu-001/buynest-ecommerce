import dns from "node:dns";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import userRouter from "./routes/user.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import roomRouter from "./routes/room.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// API Endpoints
app.get("/", (req, res) => {
  res.send("Hello World From Server");
});

app.use("/images", express.static("uploads"));
app.use("/api/users", userRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/room", roomRouter);
app.use("/api/bookings", bookingRouter);

// error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// database connection
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });

    server.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
  })
  .catch((err) => console.log("MONGO DB Connection Failed!!! :", err));
