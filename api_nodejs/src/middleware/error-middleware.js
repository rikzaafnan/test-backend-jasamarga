import {ResponseError} from "../error/response-error.js";
import {logger} from "../application/logging.js";
import { json, request } from "express";

const errorMiddleware = async (err, req, res, next) => {

    const requestBody = req.body ? JSON.stringify(req.body, null, 2) : 'No body';

    if (err.code === 'ER_PARSE_ERROR') {
        logger.error(`Error: ${err.message} error-stack: (${err.stack})  "${req.originalUrl}" (${req.headers['user-agent']}) RequestID: ${req.requestId} Body: ${requestBody}`);
        res.status(400).json({
            errors: "terjadi kesalahan di server",
            status: 400,
            message: "terjadi kesalahan di server"

        }).end();
    } else if  (err instanceof ResponseError) {

        logger.error(`Error: ${err.message} error-stack: (${err.stack})  "${req.originalUrl}" (${req.headers['user-agent']}) RequestID: ${req.requestId} Body: ${requestBody}`);
        return res.status(err.status).json({
            errors:  err.message,
            status: err.status,
            message:  err.message
        }).end();
    } else if (err.message === '404') {

        logger.error(`Error: ${err.message} error-stack: (${err.stack})  "${req.originalUrl}" (${req.headers['user-agent']}) RequestID: ${req.requestId} Body: ${requestBody}`);
        res.status(400).json({
            errors: "record not found",
            status: 404,
            message: "record not found"
        }).end();
    }else if (err.code === 'ER_BAD_FIELD_ERROR') {

        logger.error(`Error: ${err.message} error-stack: (${err.stack})  "${req.originalUrl}" (${req.headers['user-agent']}) RequestID: ${req.requestId} Body: ${requestBody}`);
        res.status(422).json({
            errors: "params not found",
            status: 422,
            message: "params not found"
        }).end();
    } else {
        logger.error(`Error-message: ${err.message} error-stack: (${err.stack}) "${req.originalUrl}" (${req.headers['user-agent']}) RequestID: ${req.requestId} Body: ${requestBody}`);
        res.status(500).json({
            errors: "terjadi kesalahan di server",
            status: 500,
            message: "terjadi kesalahan di server"
        }).end();
    }

}

export {
    errorMiddleware
}