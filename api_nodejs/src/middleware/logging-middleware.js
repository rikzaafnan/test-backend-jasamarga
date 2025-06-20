import {logger} from "../application/logging.js";
import { v4 as uuidv4 } from 'uuid';

const loggingMiddleware = (req, res, next) => {
    // Waktu permintaan dimulai
    const startTime = Date.now();
    let visitor = "visitor"

    req.startTime = startTime;
    req.requestId = uuidv4(); // Membuat dan menetapkan UUID

    let requestBody = req.body ? JSON.parse(JSON.stringify(req.body)) : 'No body';

    requestBody = maskPasswordInRequestBody(requestBody);

    logger.info(`incoming request : ${req.method} "${req.originalUrl}" "${req.ip}" (${req.headers['user-agent']}) ${((Date.now() - req.startTime) / 1000).toFixed(9)}s (${visitor}) RequestID: ${req.requestId} Body: ${requestBody} `);

    // Menangkap peristiwa selesai permintaan
    res.on('finish', () => {

        if (typeof req.userToken !== "undefined") {
            visitor = `${req.userToken.email}`
        }

        // Waktu permintaan selesai
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;

        logger.info(`after request : [${res.statusCode}] ${req.method} "${req.originalUrl}" "${req.ip}" (${req.headers['user-agent']}) ${((elapsedTime) / 1000).toFixed(9)}s (${visitor})  RequestID: ${req.requestId} Body: ${requestBody} `);

    });

    next();
}

export {
    loggingMiddleware
}

function maskPasswordInRequestBody(body) {
    if (body && body.password) {
        body.password = '*'.repeat(body.password.length);
    }

    return JSON.stringify(body)
}


