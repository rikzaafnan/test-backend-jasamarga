import response from "../../helper/response.js";
import {logger} from "../../application/logging.js";
import reportEmployeeSvc from "../../services/report/employee.js";

const getReport = async(req, res, next) => {
    try {

        let results = await reportEmployeeSvc.getReportEmployee({rreqRequestID:req.requestId})
        
        if (results.data === null) {

            let statusCode = 500
            let message = "internal server error"
            if (results.statusCode !== 500) {
                statusCode = results.statusCode
                message = results.message
            }

            let responseParams={
                status : statusCode,
                content : [],
                message : message,
            }
            return res.status(responseParams.status).json(response.successResponse(responseParams));
        }

        let responseParams={
            status : 200,
            content : results.data,
            message : "success",
        }

        res.status(responseParams.status).json(response.successResponse(responseParams));
    } catch (e) {

        logger.error("failed get report employee", {
            request_id:req.requestId,
            location:"controller/report/employee.getReport",
            method:"getReport",
            error:{
                name: e.name,
                message: e.message,
                stack: e.stack
            },
        });

        next(e);
    }
}

export default {
    getReport
}