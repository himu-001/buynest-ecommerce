import Booking from "../models/booking.models.js";
import Room from "../models/room.models.js";
import Hotel from "../models/hotel.models.js";
import User from "../models/user.models.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

import transporter from "../config/nodemailer.js";
import crypto from "crypto";

// Function to check availability of a room
const checkAvailability = async ({ room, checkInDate, checkOutDate }) => {
  if (!room || !checkInDate || !checkOutDate) {
    throw new ApiError(
      400,
      "Room, check-in date and check-out date are required"
    );
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (
    Number.isNaN(checkIn.getTime()) ||
    Number.isNaN(checkOut.getTime()) ||
    checkOut <= checkIn
  ) {
    throw new ApiError(400, "Invalid check-in or check-out dates");
  }

  const roomData = await Room.findById(room);

  if (!roomData) {
    throw new ApiError(404, "Room not found");
  }

  // Ignore bookings whose simulated payment failed
  const booking = await Booking.findOne({
    room,
    paymentStatus: { $ne: "failed" },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });

  return !booking;
};

// API to check availability of a room
// POST /api/bookings/check-availability
const checkRoomAvailability = asyncHandler(async (req, res) => {
  const { room, checkInDate, checkOutDate } = req.body;

  const isAvailable = await checkAvailability({
    room,
    checkInDate,
    checkOutDate,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isAvailable },
        isAvailable ? "Room is available" : "Room is not available"
      )
    );
});

// API to create a booking
// POST /api/bookings/book
const bookRoom = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { room, checkInDate, checkOutDate, persons } = req.body;

  if (!room || !checkInDate || !checkOutDate || !persons) {
    throw new ApiError(400, "All booking fields are required");
  }

  if (!Number.isInteger(Number(persons)) || Number(persons) < 1) {
    throw new ApiError(400, "Number of persons must be at least 1");
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (
    Number.isNaN(checkIn.getTime()) ||
    Number.isNaN(checkOut.getTime()) ||
    checkOut <= checkIn
  ) {
    throw new ApiError(400, "Invalid booking dates");
  }

  // Check room availability
  const isAvailable = await checkAvailability({
    room,
    checkInDate: checkIn,
    checkOutDate: checkOut,
  });

  if (!isAvailable) {
    throw new ApiError(409, "Room is not available for the selected dates");
  }

  // Fetch room and associated hotel
  const roomData = await Room.findById(room).populate("hotel");

  if (!roomData || !roomData.hotel) {
    throw new ApiError(404, "Room or associated hotel not found");
  }

  if (
    typeof roomData.pricePerNight !== "number" ||
    roomData.pricePerNight <= 0
  ) {
    throw new ApiError(500, "Invalid room pricing configuration");
  }

  // Calculate total price
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / millisecondsPerDay
  );

  if (nights < 1) {
    throw new ApiError(400, "Booking must be for at least one night");
  }

  const totalPrice = roomData.pricePerNight * nights * Number(persons);

  // Create pending booking
  const booking = await Booking.create({
    user: userId,
    room: roomData._id,
    hotel: roomData.hotel._id,
    checkIn,
    checkOut,
    persons: Number(persons),
    totalPrice,
    paymentMethod: "Mock Payment",
    status: "pending",
    isPaid: false,
    paymentStatus: "pending",
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, booking, "Booking created. Proceed to payment.")
    );
});

// API to simulate payment
// POST /api/bookings/simulate-payment
const simulatePayment = asyncHandler(async (req, res) => {
  // Never allow mock payments in production
  if (
    process.env.NODE_ENV === "production" ||
    process.env.MOCK_PAYMENTS_ENABLED !== "true"
  ) {
    throw new ApiError(403, "Mock payments are disabled");
  }

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  const { bookingId, outcome } = req.body;

  if (!bookingId || !["success", "failure"].includes(outcome)) {
    throw new ApiError(400, "Invalid payment details");
  }

  // Find booking belonging to the logged-in user
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  }).populate("user hotel room");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Prevent duplicate successful payments
  if (booking.isPaid) {
    throw new ApiError(409, "This booking has already been paid");
  }

  // Only pending or previously failed bookings can be retried
  if (!["pending", "failed"].includes(booking.paymentStatus)) {
    throw new ApiError(409, "Invalid payment state");
  }

  // Simulate failed payment
  if (outcome === "failure") {
    booking.paymentStatus = "failed";
    booking.isPaid = false;

    await booking.save();

    return res
      .status(200)
      .json(new ApiResponse(200, booking, "Simulated payment failed"));
  }

  // Simulate successful payment
  booking.isPaid = true;
  booking.paymentStatus = "success";
  booking.status = "confirmed";

  booking.transactionId = `MOCK_${crypto.randomUUID()}`;
  booking.paidAt = new Date();

  await booking.save();

  // Send confirmation email
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: booking.user.email,
      subject: "Room Booked Successfully",

      html: `
                <h1>Hotel Booking Confirmation</h1>

                <p>Dear ${booking.user.name},</p>

                <p>
                    Your simulated payment was successful.
                    Your booking is now confirmed.
                </p>

                <ul>
                    <li>Booking ID: ${booking._id}</li>
                    <li>Hotel: ${booking.hotel.hotelName}</li>
                    <li>Room Type: ${booking.room.roomType}</li>
                    <li>Check-in: ${booking.checkIn}</li>
                    <li>Check-out: ${booking.checkOut}</li>
                    <li>Persons: ${booking.persons}</li>
                    <li>Total Price: $${booking.totalPrice}</li>
                    <li>Transaction ID: ${booking.transactionId}</li>
                </ul>

                <p>
                    <strong>
                        Demo payment only. No real money was transferred.
                    </strong>
                </p>
            `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Do not undo a successful booking if email delivery fails
    console.error("Confirmation email failed:", error);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, booking, "Payment successful. Booking confirmed.")
    );
});

// API to get all bookings for a user
// GET /api/bookings/user
const getUserBookings = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  const bookings = await Booking.find({ user: userId })
    .populate("room")
    .populate("hotel")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "User bookings fetched successfully"));
});

// API to get all bookings for a hotel
// GET /api/bookings/hotel
const getHotelBookings = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  const hotels = await Hotel.find({ owner: userId }).select("_id");

  const hotelIds = hotels.map((hotel) => hotel._id);

  const bookings = await Booking.find({
    hotel: { $in: hotelIds },
  })
    .populate("room")
    .populate("hotel")
    .populate("user")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, bookings, "Hotel bookings fetched successfully")
    );
});

export {
  checkAvailability,
  checkRoomAvailability,
  bookRoom,
  simulatePayment,
  getUserBookings,
  getHotelBookings,
};
