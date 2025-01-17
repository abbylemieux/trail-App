import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface UserPayload {
    id: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserPayload;
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Token validation error: No token provided');
        res.status(401).json({ message: 'No token provided' });
        return; 
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.user = { id: decoded.userId };
        console.log('Token validated');
        next();
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(401).json({ message: 'Invalid token' });
        return; 
    }
};
