import Room from "../models/room.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// add a new room
const addRoom = asyncHandler(async (req, res) => {
    const { roomType, hotel, pricePerNight, description, amenities, isAvailable } = req.body;

    const image = req.files?.map((file) => file.filename);

    const newRoom = await Room.create({
        roomType,
        hotel,
        pricePerNight,
        description,
        amenities,
        isAvailable,
        images: image
    });

    return res.status(201).json(new ApiResponse(201, newRoom, "Room added successfully"))
})

// get all rooms for specific owner
const getOwnerRooms = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const rooms = await Room.find().populate(
        {
            path: "hotel",
            match: { owner: id },
            select: "hotelName. hotelAddress rating amenities"
        }
    );
    const ownerRooms = rooms.filter((room) => room.hotel.owner === id);

    return res.status(200).json(new ApiResponse(200, rooms, "Rooms fetched successfully"));
});

// get all rooms for user
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
    
    return res.status(200).json(new ApiResponse(200, rooms, "Rooms fetched successfully"));
    
});

// delete a room
const deleteRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    const deletedRoom = await Room.findByIdAndDelete(roomId);

    if (!deletedRoom) {
        throw new ApiError(404, "Room not found");
    }

    return res.status(200).json(new ApiResponse(200, deletedRoom, "Room deleted successfully"))
})

export { addRoom, getOwnerRooms, getAllRooms, deleteRoom};