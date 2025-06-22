import {logger} from "../../application/logging.js";
import employeeModel from "../../models/employee/employee.js";
import employeeProfileModel from "../../models/employee/employee-profile.js";
import employeeEducationModel from "../../models/employee/education.js";
import employeeFamilyModel from "../../models/employee/family.js";
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

    const tx = await sequelize.transaction();

    try {

        let employeeID = null
        let runOnPromises = []

        // insert employee
        let insertEmployeeReq = {
            reqNIK : reqBody.nik,
            reqName : reqBody.name,
            reqIsActive : reqBody.is_active,
            reqIsStartDate : reqBody.start_date,
            reqIsEndDate : reqBody.end_date,
            reqCreatedBy: "admin",
        }
        let insertEmployeeResult = await employeeModel.createEmployee(insertEmployeeReq,tx, reqRequestID)
        if (insertEmployeeResult.data === null) {
            await tx.rollback()
            content.data = null
            content.message = "data not found"
            content.statusCode = 404

            return content

        }

        employeeID = insertEmployeeResult.data

        // insert employee profile
        let insertEmployeeProfileReq = {
            reqEmployeeID : employeeID,
            reqPlaceOfBirth : reqBody.place_of_birth,
            reqDateOfBirth : reqBody.date_of_birth,
            reqGender : reqBody.gender,
            reqIsMarried : reqBody.is_married,
            reqProfilePicture : reqBody.profile_picture,
            reqCreatedBy: "admin",
        }
        // let insertEmployeeProfileResult = await employeeProfileModel.createEmployeeProfile(insertEmployeeProfileReq,tx, reqRequestID)
        // if (insertEmployeeProfileResult.data === null) {
        //     await tx.rollback()
        //     content.data = null
        //     content.message = "data not found"
        //     content.statusCode = 404

        //     return content

        // }

        runOnPromises.push({
                        name:"insertEmployeeProfileResult",
                        promise: employeeProfileModel.createEmployeeProfile(insertEmployeeProfileReq,tx, reqRequestID)
                    })

        // insert educations
        if (reqBody.educations.length > 0) {
            let insertEducations = []
            for (const education of reqBody.educations) {
                let insertEducation = {
                    reqEmployeeID : employeeID,
                    reqName:education.name,
                    reqLevel:education.level,
                    reqDescription:education.description,
                    reqCreatedBy: "admin",
                }
                insertEducations.push(insertEducation)
            }
            // let insertEmployeeEducationResult =await employeeEducationModel.createEmployeeEducationBulks(insertEducations, employeeID, tx, reqRequestID)
            // if (insertEmployeeEducationResult.data === null) {
            //     await tx.rollback()
            //     content.data = null
            //     content.message = "data not found"
            //     content.statusCode = 404

            //     return content

            // }

            runOnPromises.push({
                        name:"insertEmployeeEducationResult",
                        promise: employeeEducationModel.createEmployeeEducationBulks(insertEducations, employeeID, tx, reqRequestID)
                    })

        }

        // insert families
        if (reqBody.families.length > 0) {
            let insertFamilies = []
            for (const family of reqBody.families) {
                let insertFamily = {
                    reqEmployeeID : employeeID,
                    reqName:family.name,
                    reqIdentifier:family.identifier,
                    reqJob:family.job,
                    reqPlaceOfBirth : family.place_of_birth,
                    reqDateOfBirth : family.date_of_birth,
                    reqReligion : family.religion,
                    reqIsLife : family.is_life,
                    reqIsDivorced : family.is_divorced,
                    reqRelationStatus : family.relation_status,
                    reqCreatedBy: "admin",
                }
                insertFamilies.push(insertFamily)
            }

            // let insertEmployeeFamilyResult =await employeeFamilyModel.createEmployeeFamilyBulks(insertFamilies, employeeID, tx, reqRequestID)
            // if (insertEmployeeFamilyResult.data === null) {
            //     await tx.rollback()
            //     content.data = null
            //     content.message = "data not found"
            //     content.statusCode = 404

            //     return content

            // }

            runOnPromises.push({
                        name:"insertEmployeeFamilyResult",
                        promise: employeeFamilyModel.createEmployeeFamilyBulks(insertFamilies, employeeID, tx, reqRequestID)
                    })

        }

        try {
            if (runOnPromises.length > 0) {
                let index = 0
                const results = await Promise.all(runOnPromises.map(p => p.promise));
                for (const result of results) {

                    if (result.data === null) {
                        await tx.rollback()
                        content.message = "failed insert data employee"

                        logger.error("failed insert data employee", {
                            request_id:reqRequestID,
                            location:"services/employee/employee.createEmployee",
                            method:`runOnPromises[${runOnPromises[index].name}]`,
                            error:{
                                name: error.name,
                                message: error.message,
                                stack: error.stack
                            },
                        });

                        return content

                    }

                    index++

                }

            }
        } catch (error) {
            await tx.rollback();
            content.message = "failed insert data employee"

            logger.error("error promises", {
                request_id:reqRequestID,
                location:"services/employee/employee.createEmployee",
                method:"createEmployee",
                error:{
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                },
            });

            return content;
        }

        await tx.rollback()

        content.data = 1
        content.message = "success"
        content.statusCode = 200

    } catch (e) {

        logger.error("failed create employee", {
            request_id:reqRequestID,
            location:"services/employee/employee.createEmployee",
            method:"createEmployee",
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