import {logger} from "../../application/logging.js";
import employeeModel from "../../models/employee/employee.js";
import {sequelize} from "../../application/db/datasource/database.js";

const findAllEmployees = async(
    {
        reqFilters = null,
        reqRequestID = null
    } = {}) => {
    let content = {
        data : null,
        statusCode:500,
        message : "failed"
    }
    try {

        let results = await employeeModel.findAllEmployee(reqFilters,false, reqRequestID)
        if (results.data === null) {
            content.data = null
            content.message = "data not found"
            content.statusCode = 404

            return content

        }

        content.data = results.data
        content.message = "success"
        content.statusCode = 200

    } catch (e) {

        logger.error("failed get all outlet area spreading", {
            request_id:reqRequestID,
            location:"services/employee/employee.findAllEmployees",
            method:"findAllEmployees",
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

const getOneByID = async(
    {
        reqEmployeeID = null,
        reqRequestID = null
    } = {}) => {
    let content = {
        data : null,
        statusCode:500,
        message : "failed"
    }
    try {

        let results = await employeeModel.getOneEmployeeByID(reqEmployeeID,false, reqRequestID)
        if (results.data === null) {
            content.data = null
            content.message = "data not found"
            content.statusCode = 404

            return content

        }

        content.data = results.data
        content.message = "success"
        content.statusCode = 200

    } catch (e) {

        logger.error("failed get detail outlet spreading", {
            request_id:reqRequestID,
            location:"services/agent/area-spreading.findDetailOutletSpreading",
            method:"findDetailOutletSpreading",
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

const updateOneByID = async(
    {
        reqOutletAreaSpreadingID = null,
        reqDistrictID = null,
        reqVillageID = null,
        reqCityID = null,
        reqOwnerOutletName= null,
        reqAge= null,
        reqGender= null,
        reqPhone= null,
        reqEmail= null,
        reqOutletName= null,
        reqLatitude= null,
        reqLongitude= null,
        reqAddress= null,
        reqOutletCategory= null,
        reqIsUsedAppPos= null,
        reqAppPosName= null,
        reqIsCustomerListFB= null,
        reqDevices= null,
        reqStoreManagement= null,
        reqStoreResponse= null,
        reqStoreCondition= null,
        reqNote= null,
        reqReason= null,
        reqUserID = null,
        reqDateFollowUp = null,
        reqRequestID = null
    } = {}) => {
    let content = {
        data : null,
        statusCode:500,
        message : "failed"
    }
    try {

        let results = await areaSpreadingAgentModel.getOneOutletAreaSpreadingByID(reqOutletAreaSpreadingID,false,reqRequestID)
        if (results.data === null) {
            content.data = null
            content.message = "data not found"
            content.statusCode = 404

            return content

        }

        let device = null
        if (reqDevices !== null && reqDevices !== undefined) {
            if (Array.isArray(reqDevices)) {
                if (reqDevices.length > 0) {
                    device = reqDevices.join(",");
                }
            }
        }

        let storeCondition = null
        if (reqStoreCondition !== null && reqStoreCondition !== undefined) {
            if (Array.isArray(reqStoreCondition)) {
                if (reqStoreCondition.length > 0) {
                    storeCondition = reqStoreCondition.join(",");
                }
            }
        }

        let dtoUpdateData = {
            reqDistrictID:reqDistrictID,
            reqVillageID:reqVillageID,
            reqCityID:reqCityID,
            reqOwnerOutletName:reqOwnerOutletName,
            reqAge:reqAge,
            reqGender:reqGender,
            reqPhone:reqPhone,
            reqEmail:reqEmail,
            reqOutletName:reqOutletName,
            reqLatitude:reqLatitude,
            reqLongitude:reqLongitude,
            reqAddress:reqAddress,
            reqOutletCategory:reqOutletCategory,
            reqIsUsedAppPos:reqIsUsedAppPos,
            reqAppPosName:reqAppPosName,
            reqIsCustomerListFB:reqIsCustomerListFB,
            reqDevices:device,
            reqStoreManagement:reqStoreManagement,
            reqStoreResponse:reqStoreResponse,
            reqStoreCondition:storeCondition,
            reqNote:reqNote,
            reqReason:reqReason,
            reqUserID :reqUserID,
            reqDateFollowUp :reqDateFollowUp,
        }

        let updatedData = await areaSpreadingAgentModel.updateOneOutletAreaSpreadingByID(reqOutletAreaSpreadingID,dtoUpdateData,false, reqRequestID)
        if (updatedData.data === null) {
            content.data = null
            content.message = "data not found"
            content.statusCode = 404

            return content

        }

        content.data = results.data
        content.message = "success"
        content.statusCode = 200

    } catch (e) {

        logger.error("failed update outlet spreading", {
            request_id:reqRequestID,
            location:"services/agent/area-spreading.updateOutletSpreading",
            method:"updateOutletSpreading",
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

const deleteOneByID = async(
    {
        reqEmployeeID = null,
        reqRequestID = null
    } = {}) => {
    let content = {
        data : null,
        statusCode:500,
        message : "failed"
    }

    const tx = await sequelize.transaction();

    try {

        let results = await employeeModel.deleteOneByID(reqEmployeeID,tx,reqRequestID)
        if (results.data === null) {
            await tx.Rollback()
            content.data = null
            content.message = "data not found"
            content.statusCode = 404

            return content

        }
        
        await tx.Rollback()

        content.data = results.data
        content.message = "success"
        content.statusCode = 200

    } catch (e) {

        logger.error("failed update outlet spreading", {
            request_id:reqRequestID,
            location:"services/agent/area-spreading.updateOutletSpreading",
            method:"updateOutletSpreading",
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

const createEmployee = async(
    {
        reqBody = null,
        reqRequestID = null
    } = {}) => {
    let content = {
        data : null,
        statusCode:500,
        message : "failed"
    }
    try {

        console.log("reqBody", reqBody)

        // insert employee
        let insertEmployeeReq = {
            reqNIK : reqBody.nik,
            reqFullName : reqBody.fullName,
        }

        // insert employee profile

        // insert educations

        // insert families
        

        content.data = 1
        content.message = "success"
        content.statusCode = 200

    } catch (e) {

        logger.error("failed update outlet spreading", {
            request_id:reqRequestID,
            location:"services/agent/area-spreading.updateOutletSpreading",
            method:"updateOutletSpreading",
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
    findAllEmployees, getOneByID, createEmployee, updateOneByID, deleteOneByID
}