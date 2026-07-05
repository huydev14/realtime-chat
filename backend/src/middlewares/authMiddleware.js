import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//  Authorization
export const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Access token is missing' });
        }

        // verify token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(403).json({ message: 'Invalid or expired token' });
            }

            // find user
            const user = await User.findById(decoded.userId).select('-hashedPassword');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // attach user to request
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
