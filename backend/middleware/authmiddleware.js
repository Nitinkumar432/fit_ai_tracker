// Middleware to check user authentication
export const ensureAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next(); // User is logged in, proceed
    }
    return res.status(401).json({ message: "Unauthorized. Please log in first." });
};

// Middleware to prevent logged-in users from accessing login/register pages
export const preventAuthAccess = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.status(403).json({ message: "You are already logged in." });
    }
    return next(); // User is NOT logged in, proceed
};
