import {logger} from "../../application/logging.js";
import reportEmployeeModel from "../../models/reports/employee.js";

const getReportEmployee = async(
    {
        reqRequestID = null
    } = {}) => {
    let content = {
        data : null,
        statusCode:500,
        message : "failed"
    }
    try {

        let results = await reportEmployeeModel.getReportEmployee(false, reqRequestID)
        if (results.data === null) {
            content.data = null
            content.message = "data not found"
            content.statusCode = 404

            return content

        }

        console.log("getReportEmployee", reqRequestID)

        content.data = results.data
        content.message = "success"
        content.statusCode = 200

    } catch (e) {

        logger.error("failed get report", {
            request_id:reqRequestID,
            location:"services/report/employee.getReportEmployee",
            method:"getReportEmployee",
            error:{
                name: e.name,
                message: e.message,
                stack: e.stack
            },
        });

        content.message = "error"
    }

    return content

}

export default {
    getReportEmployee
}