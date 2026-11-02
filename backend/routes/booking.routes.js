import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Owner } from "../middlewares/owner.middleware.js";
import {
    checkAvailability,
    checkRoomAvailability,
    bookRoom,
    getUserBookings,
    getHotelBookings
} from "../controllers/booking.controllers.js";
import { upload } from "../config/multer.js";

const bookingRouter = express.Router();

bookingRouter.route("/check-availability").post(upload.single("image"), checkRoomAvailability);
bookingRouter.route("/book").post(verifyJWT, bookRoom);
bookingRouter.route("/user").get(verifyJWT, getUserBookings);
bookingRouter.route("/hotel").get(verifyJWT, Owner, getHotelBookings);

export default bookingRouter;
