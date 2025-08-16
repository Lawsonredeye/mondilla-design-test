import jwt from 'jsonwebtoken';
import 'dotenv/config'

export const JWT_KEY = process.env.JWT_KEY

export default function CreateJwtToken(user_id, user_name, role) {
    try {
    return jwt.sign({user_id: user_id, user_name, role}, JWT_KEY, {expiresIn: '2h'});
    } catch (e) {
        console.log("failed to load environment variable to console: ", e)
        return null
    }
}

export function VerifyJwtToken(token) {
    try {
        return jwt.verify(token, JWT_KEY);
    } catch (err) {
        return null
    }
}
