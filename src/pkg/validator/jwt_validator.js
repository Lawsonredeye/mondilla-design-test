import jwt from 'jsonwebtoken';

export const JWT_KEY = process.env.JWT_KEY

export default function CreateJwtToken(user_id, user_name, role) {
    return jwt.sign({user_id: user_id, user_name, role}, JWT_KEY, {expiresIn: '2h'});
}

export function VerifyJwtToken(token) {
    try {
        return jwt.verify(token, JWT_KEY);
    } catch (err) {
        return null
    }
}
