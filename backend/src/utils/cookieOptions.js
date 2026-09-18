/**
 * Centralized cookie configuration
 * In development over HTTP, secure must be false and sameSite 'lax' to prevent browsers dropping cookies.
 * In production over HTTPS, secure is true and sameSite 'none' for cross-domain support.
 */
export const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
};
