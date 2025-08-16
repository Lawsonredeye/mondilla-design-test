import { VerifyJwtToken } from "../pkg/validator/jwt_validator.js";

function protectedAuth(req, res, next) {
    if (req.headers.authorization) {
        let reqToken = ""
        if (req.headers.authorization.startsWith("Bearer ")) {
            reqToken = req.headers.authorization.split(" ")[1];
        } else {
            reqToken = req.headers.authorization
        }
        const token = VerifyJwtToken(reqToken);
        if (!token) {
            return res.status(401).send({ message: "invalid access token", status: "error" });
        }
        req.set("clientId", token.user_id);
        req.set("userName", token.user_name);
        req.set("role", token.role);
        next();
    } else {
        return res.status(401).send({ message: "Unauthorized access", status: "error" });
    }
}

export default protectedAuth;