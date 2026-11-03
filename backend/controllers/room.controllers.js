import Room from "../models/room.models.js";
import Hotel from "../models/hotel.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add a new room
const addRoom = asyncHandler(async (req, res) => {
  const {
    roomType,
    hotel,
    pricePerNight,
    description,
    amenities,
    isAvailable,
  } = req.body;

  const images = req.files?.map((file) => file.filename) || [];

  if (!roomType || !hotel || !pricePerNight || images.length === 0) {
    throw new ApiError(
      400,
      "Please provide all required room details and images"
    );
  }

  // Verify that the hotel belongs to the logged-in owner
  const existingHotel = await Hotel.findOne({
    _id: hotel,
    owner: req.user.id,
  });

  if (!existingHotel) {
    throw new ApiError(404, "Hotel not found or you don't own this hotel");
  }

  const newRoom = await Room.create({
    roomType,
    hotel,
    pricePerNight,
    description,
    amenities,
    isAvailable,
    images,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newRoom, "Room added successfully"));
});

// Get all rooms belonging to the logged-in owner
const getOwnerRooms = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const hotels = await Hotel.find({ owner: id }).select("_id");

  const hotelIds = hotels.map((hotel) => hotel._id);

  const rooms = await Room.find({
    hotel: { $in: hotelIds },
  }).populate({
    path: "hotel",
    select: "hotelName hotelAddress rating amenities",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, rooms, "Rooms fetched successfully"));
});

// Get all rooms for customers
const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find()
    .populate({
      path: "hotel",
      select: "hotelName hotelAddress amenities rating owner",
      populate: {
        path: "owner",
        select: "name email",
      },
    })
    .exec();

  return res
    .status(200)
    .json(new ApiResponse(200, rooms, "Rooms fetched successfully"));
});

// Delete a room
const deleteRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const deletedRoom = await Room.findByIdAndDelete(roomId);

  if (!deletedRoom) {
    throw new ApiError(404, "Room not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedRoom, "Room deleted successfully"));
});

export { addRoom, getOwnerRooms, getAllRooms, deleteRoom };
