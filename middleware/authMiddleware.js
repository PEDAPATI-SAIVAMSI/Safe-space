const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user in the database
            req.user = await User.findById(decoded.id).select('-password');

            // If the user does not exist, send an error response
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Proceed to the next middleware
            return next();
        } catch (err) {
            console.error('JWT Error:', err.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is provided in the headers
    return res.status(401).json({ message: 'Not authorized, no token provided' });
};


const authorize = (...roles) => {
    return (req, res, next) => {
        console.log('Authorized roles:', roles); // Log roles allowed for the route
        console.log('User role:', req.user.role); // Log the role attached to the user

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role '${req.user.role}' is not authorized` });
        }
        next();
    };
};

module.exports = { protect, authorize };
