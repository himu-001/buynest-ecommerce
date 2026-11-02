import Booking from "../models/booking.models.js";
import Room from "../models/room.models.js";
import Hotel from "../models/hotel.models.js";
import User from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// Function to check availability of a room
const checkAvailability = async ({ room, checkInDate, checkOutDate }) => {

    if (!room || !checkInDate || !checkOutDate) {
        throw new ApiError(400, "Room, check-in date and check-out date are required");
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

    const booking = await Booking.findOne({
        room,
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

    return res.status(200).json(
        new ApiResponse(
            200,
            { isAvailable },
            isAvailable ? "Room is available" : "Room is not available"
        )
    );
});


// API to book a room
// POST /api/bookings/book
const bookRoom = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User authentication required");
    }

    const {
        room,
        checkInDate,
        checkOutDate,
        persons,
        paymentMethod,
    } = req.body;

    if (!room || !checkInDate || !checkOutDate || !persons || !paymentMethod) {
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
        throw new ApiError(400, "Invalid check-in or check-out dates");
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

    if (!roomData) {
        throw new ApiError(404, "Room not found");
    }

    if (!roomData.hotel) {
        throw new ApiError(404, "Associated hotel not found");
    }

    if (typeof roomData.pricePerNight !== "number" || roomData.pricePerNight < 0) {
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

    const totalPrice = roomData.pricePerNight * nights * persons;

    // Create booking
    const booking = await Booking.create({
        user: userId,
        room: roomData._id,
        hotel: roomData.hotel._id,
        checkIn,
        checkOut,
        persons: Number(persons),
        totalPrice,
        paymentMethod,
    });

    return res.status(201).json(
        new ApiResponse(201, booking, "Room booked successfully")
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

    return res.status(200).json(
        new ApiResponse(
            200,
            bookings,
            "User bookings fetched successfully"
        )
    );
});

// API to get all bookings for a hotel
// GET /api/bookings/hotel
const getHotelBookings = asyncHandler(async (req, res) => {
    const userId = req.user._id; // ID of owner of hotel

    const hotels = await Hotel.find({ owner: userId }).select("_id");

    const hotelIds = hotels.map((hotel) => hotel._id);

    const bookings = await Booking.find({
        hotel: { $in: hotelIds },
    })
        .populate("room")
        .populate("hotel")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            bookings,
            "Hotel bookings fetched successfully"
        )
    );
});

export {
    checkAvailability,
    checkRoomAvailability,
    bookRoom,
    getUserBookings,
    getHotelBookings
};