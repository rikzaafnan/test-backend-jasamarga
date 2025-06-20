import jwt from 'jsonwebtoken';
import response from "../helper/response.js";
import {logger} from "../application/logging.js"

function authenticateAccessToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        let responseParams={
            status : 401,
            content : [],
            message : "Unauthorized: Token is missing or invalid format",
        }
        return res.status(401).json(response.successResponse(responseParams));
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, jwtKeyAccessToken, async (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {

                let responseParams = {
                    status: 401,
                    content: [],
                    message: "Unauthorized: Token has expired",
                }
                return res.status(401).json(response.successResponse(responseParams));

            } else {
                let responseParams = {
                    status: 403,
                    content: [],
                    message: "Forbidden: Invalid token",
                }
                return res.status(403).json(response.successResponse(responseParams));
            }

        }

        req.userToken =user;
        next();
    });

}

export default {
    authenticateAccessToken
}