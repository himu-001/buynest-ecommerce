import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";

const Owner = asyncHandler((req, res, next) => {
    try { 
        if(req.user?.role === "owner") {
            next();
        } else {
            throw new ApiError("Only owners can perform this action", 403);
        }
    }
    catch (error) { 
        throw new ApiError(error.message, 500);
    }
});

export { Owner };