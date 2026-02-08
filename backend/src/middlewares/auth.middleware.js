// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken"
// import { User } from "../models/user.model.js";

// export const verifyJWT = asyncHandler(async(req, _, next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
//         // console.log(token);
//         if (!token) {
//             throw new ApiError(401, "Unauthorized request")
//         }
    
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
//         if (!user) {
            
//             throw new ApiError(401, "Invalid Access Token")
//         }
    
//         req.user = user;
//         next()
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid access token")
//     }
    
// })



import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Cache for user lookups - prevents repeated DB queries
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Clean cache periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of userCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
            userCache.delete(key);
        }
    }
}, 60 * 1000); // Clean every minute

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Extract token
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        if (!decodedToken?._id) {
            throw new ApiError(401, "Invalid token payload");
        }

        // Check cache first
        const cacheKey = `user:${decodedToken._id}`;
        const cached = userCache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            req.user = cached.user;
            return next();
        }

        // Query database with minimal fields
        const user = await User.findById(decodedToken._id)
            .select("-password -refreshToken")
            .lean(); // Use lean() for better performance

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Cache the user
        userCache.set(cacheKey, {
            user,
            timestamp: Date.now()
        });

        req.user = user;
        next();
    } catch (error) {
        // Handle JWT errors specifically
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid token format");
        }
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Token expired");
        }
        
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

// Export cache clear function for use in logout
export const clearUserCache = (userId) => {
    userCache.delete(`user:${userId}`);
};