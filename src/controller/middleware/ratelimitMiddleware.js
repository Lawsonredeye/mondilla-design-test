import rateLimit from "express-rate-limit";

const rateLimitMiddleware = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {
        status: "error",
        message: "Too many requests, please try again later.",
    },
});

export default rateLimitMiddleware;