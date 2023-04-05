import jwt from 'jsonwebtoken';
import { createError } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(createError(401, 'Please log in to access this page'));
    }

    const JWT_SECRET = process.env.JWT;
    if (!JWT_SECRET) {
        return next(createError(500, 'Internal Server Error'));
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return next(createError(403, 'Please log in again'));
        }

        req.user = user;
        next();
    });
};
