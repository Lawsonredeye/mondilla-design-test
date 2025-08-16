import bcrypt from 'bcrypt';

export function Hashpassword(password) {
    if (!password || typeof password !== 'string') {
        return null
    }
    return bcrypt.hashSync(password, 10);
}

export function ValidatePassword(loginPassword, currentPasswordHash) {
    if (!loginPassword || !currentPasswordHash) {
        return false;
    }
    return bcrypt.compareSync(loginPassword, currentPasswordHash);
}