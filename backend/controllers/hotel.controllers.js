import Hotel from "../models/hotel.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse as apiResponse } from "../utils/apiResponse.js";
import {ApiError as apiError} from "../utils/apiError.js";
// register a new hotel

const registerHotel = asyncHandler(async (req, res) => { 

    const { id } = req.user;
    const { hotelName, hotelAddress, rating, price, amenities } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!hotelName || !hotelAddress || !rating || !price || !amenities || !image) {
        return apiError(res, 400, "All fields are required");
    }

    const newHotel = new Hotel({
        hotelName,
        hotelAddress,
        rating,
        price,
        amenities,
        image,
        owner: id,
    }); 
    await newHotel.save();
    return res.status(201).json(new apiResponse(true, "Hotel registered successfully", null));
    
});

const getOwnerHotels = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const hotels = await Hotel.find({ owner: id }).populate("owner", "name email");
    return res.status(200).json(new apiResponse(true, "Hotels fetched successfully", hotels));
});

// get all hotels
const getAllHotels = asyncHandler(async (req, res) => { 
    const hotels = await Hotel.find().populate("owner", "name email");
    return res.status(200).json(new apiResponse(true, "Hotels fetched successfully", hotels));
});

// delete hotel 
const deleteHotel = asyncHandler(async (req, res) => { 
    const { hotelId } = req.params;
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    if (!deletedHotel) {
        return new apiError(res, 404, "Hotel not found");
    }
    return res.status(200).json(new apiResponse(true, "Hotel deleted successfully", null));
});

export { registerHotel, getOwnerHotels, getAllHotels, deleteHotel };