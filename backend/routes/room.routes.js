import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Owner } from "../middlewares/owner.middleware.js";
import { upload } from "../config/multer.js";

import {
  addRoom,
  deleteRoom,
  getAllRooms,
  getOwnerRooms,
} from "../controllers/room.controllers.js";

const roomRouter = express.Router();

roomRouter
  .route("/add")
  .post(verifyJWT, Owner, upload.array("images", 4), addRoom);

roomRouter.route("/get").get(verifyJWT, Owner, getOwnerRooms);

roomRouter.route("/get-all").get(getAllRooms);

roomRouter.route("/delete/:roomId").delete(verifyJWT, Owner, deleteRoom);

export default roomRouter;
