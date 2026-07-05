import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export const signup = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const duplicateUsername = await User.findOne({ username });
        if (duplicateUsername) {
            return res.status(409).json({ message: 'Username has already exist' });
        }

        const duplicateEmail = await User.findOne({ email });
        if (duplicateEmail) {
            return res.status(409).json({ message: 'Email has already exist' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await User.create({
            username,
            hashedPassword: hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`,
        });

        return res.sendStatus(204);
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user
        const user = await User.findOne({ userName: username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // If password is correct, create JWT
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        // Create refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // Store refresh token in database
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        // Save refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: REFRESH_TOKEN_TTL,
        });

        // return access token to client
        return res.status(200).json({ message: 'Signin successful', accessToken });
    } catch (error) {
        console.error('Error during signin:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req, res) => {
    try {
        // Get and delete refresh token
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken) {
            await Session.deleteOne({ refreshToken });
            res.clearCookie('refreshToken');
        }
        return res.sendStatus(204);
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
