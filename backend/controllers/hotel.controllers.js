import Hotel from "../models/hotel.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// Register a new hotel
const registerHotel = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { hotelName, hotelAddress, rating, price, amenities } = req.body;
  const image = req.file ? req.file.filename : null;

  if (
    !hotelName ||
    !hotelAddress ||
    rating === undefined ||
    rating === "" ||
    price === undefined ||
    price === "" ||
    !amenities ||
    !image
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const newHotel = await Hotel.create({
    hotelName,
    hotelAddress,
    rating: Number(rating),
    price: Number(price),
    amenities,
    image,
    owner: id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newHotel, "Hotel registered successfully"));
});

// Get owner's hotels
const getOwnerHotels = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const hotels = await Hotel.find({ owner: id }).populate(
    "owner",
    "name email"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, hotels, "Hotels fetched successfully"));
});

// Get all hotels
const getAllHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find().populate("owner", "name email");

  return res
    .status(200)
    .json(new ApiResponse(200, hotels, "Hotels fetched successfully"));
});

// Delete hotel
const deleteHotel = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

  if (!deletedHotel) {
    throw new ApiError(404, "Hotel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedHotel, "Hotel deleted successfully"));
});

export { registerHotel, getOwnerHotels, getAllHotels, deleteHotel };
