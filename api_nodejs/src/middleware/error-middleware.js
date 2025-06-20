import {ResponseError} from "../error/response-error.js";
import {logger} from "../application/logging.js";

const errorMiddleware = async (err, req, res, next) => {

    const requestBody = req.body ? JSON.stringify(req.body, null, 2) : 'No body';

    if (err.code === 'ER_PARSE_ERROR') {

        logger.error(`Error: terjadi kesalahan di input data "${req.originalUrl}" (${req.headers['user-agent']})`, {
            request_id:req.requestId,
            error : {
                message: err.message,
                stack: err.stack,
            },
            body: requestBody,
            location:"error-middleware"
        });

        res.status(400).json(response.errorResponse("400","terjadi kesalahan di input data",400,"terjadi kesalahan di input data")).end();


    } else if  (err instanceof ResponseError) {

        logger.error(`Error: "${req.originalUrl}" (${req.headers['user-agent']})`, {
            request_id:req.requestId,
            error : {
                message: err.message,
                stack: err.stack,
            },
            body: requestBody,
            location:"error-middleware"

        });

        res.status(400).json(response.errorResponse(`${err.status}`, err.message,err.status, err.message)).end();
    } else if (err.message === '404') {

        logger.error(`Error: record not found "${req.originalUrl}" (${req.headers['user-agent']})`, {
            request_id:req.requestId,
            error : {
                message: err.message,
                stack: err.stack,
            },
            body: requestBody,
            location:"error-middleware"

        });
        res.status(404).json(response.errorResponse('404', "record not found",404, "record not found")).end();

    }else if (err.code === 'ER_BAD_FIELD_ERROR') {

        logger.error(`Error: params not found "${req.originalUrl}" (${req.headers['user-agent']})`, {
            request_id:req.requestId,
            error : {
                message: err.message,
                stack: err.stack,
            },
            body: requestBody,
            location:"error-middleware"

        });

        res.status(422).json(response.errorResponse('422', "params not found",422, "params not found")).end();

    } else {

        logger.error(`Error: internal server error "${req.originalUrl}" (${req.headers['user-agent']})`, {
            request_id:req.requestId,
            error : {
                message: err.message,
                stack: err.stack,
            },
            body: requestBody,
            location:"error-middleware"

        });

        res.status(500).json(response.errorResponse('500', "internal server error",500, "internal server error")).end();

    }

}

export {
    errorMiddleware
}