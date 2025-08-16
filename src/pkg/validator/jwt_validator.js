import jwt from 'jsonwebtoken';
import 'dotenv/config.js'

export const JWT_KEY = process.env.JWT_KEY

export default function CreateJwtToken(user_id, user_name, role) {
    return jwt.sign({user_id: user_id, user_name, role}, JWT_KEY, {expiresIn: '10h'});
}

export function VerifyJwtToken(token) {
    try {
        return jwt.verify(token, JWT_KEY);
    } catch (err) {
        console.error("JWT verification failed:", err);
        return null
    }
}
