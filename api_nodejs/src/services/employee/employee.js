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

        logger.error("failed get all employee", {
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

        if ((results.data.deleted_at !== null) || results.data.deleted_by !== null) {
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
        reqBody = null,
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

        let runOnPromises = []

        // check employee
        let employeeResult = await employeeModel.getOneEmployeeByID(reqEmployeeID,tx, reqRequestID)
        if (employeeResult.data === null) {
            await tx.rollback()
            content.data = null
            content.message = "data not found"
            content.statusCode = 404 
            return content
        }

        if ((employeeResult.data.deleted_at !== null) || employeeResult.data.deleted_by !== null) {
            await tx.rollback()
            content.data = null
            content.message = "data not found"
            content.statusCode = 404 
            return content
        }

        // update employee
        let updateEmployeeReq = {
            reqNIK : reqBody.nik,
            reqName : reqBody.name,
            reqIsActive : reqBody.is_active,
            reqIsStartDate : reqBody.start_date,
            reqIsEndDate : reqBody.end_date,
            reqUpdatedBy: "admin",
        }
        let updateEmployeeResult = await employeeModel.updateOneByID(reqEmployeeID, updateEmployeeReq,tx, reqRequestID)
        if (updateEmployeeResult.data === null) {
            await tx.rollback()
            content.data = null
            content.message = "failed update employee"
            content.statusCode = 400

            logger.error("failed update employee", {
                request_id:reqRequestID,
                location:"services/employee/employee.updateOneByID",
                source : "models/employee/employee.updateOneByID",
                method:"updateOneByID",
            });

            return content

        }

        // update employee profile
        let updateEmployeeProfileReq = {
            reqEmployeeID : reqEmployeeID,
            reqPlaceOfBirth : reqBody.place_of_birth,
            reqDateOfBirth : reqBody.date_of_birth,
            reqGender : reqBody.gender,
            reqIsMarried : reqBody.is_married,
            reqProfilePicture : reqBody.profile_picture,
            reqUpdatedBy: "admin",
        }
       
        runOnPromises.push({
            name:"insertEmployupdateEmployeeProfileResulteeProfileResult",
            promise: employeeProfileModel.updateOneByEmployeeID(updateEmployeeProfileReq,tx, reqRequestID)
        })

        // update educations
        if (reqBody.educations.length > 0) {
            if (employeeResult.data.educations.length > 0) {
                // delete educations
                let deleteAllEducationResults = await employeeEducationModel.deleteAllByEmployeeID(reqEmployeeID, "admin",tx, reqRequestID)
                if (deleteAllEducationResults.data === null) {
                    await tx.rollback()
                    content.data = null
                    content.message = "failed update employee"
                    content.statusCode = 400

                    logger.error("failed delete current education", {
                        request_id:reqRequestID,
                        location:"services/employee/employee.updateOneByID",
                        source : "models/employee/education.deleteAllByEmployeeID",
                        method:"updateOneByID",
                    });

                    return content

                }

            }
            let insertEducations = []
            for (const education of reqBody.educations) {
                let insertEducation = {
                    reqEmployeeID : reqEmployeeID,
                    reqName:education.name,
                    reqLevel:education.level,
                    reqDescription:education.description,
                    reqCreatedBy: "admin",
                }
                insertEducations.push(insertEducation)
            }

            runOnPromises.push({
                name:"insertEmployeeEducationResult",
                promise: employeeEducationModel.createEmployeeEducationBulks(insertEducations, reqEmployeeID, tx, reqRequestID)
            })

        }

        // update families
        if (reqBody.families.length > 0) {
            let insertFamilies = []
            if (employeeResult.data.families.length > 0) {
                // delete families
                let deleteAllFamilyResults = await employeeFamilyModel.deleteAllByEmployeeID(reqEmployeeID, "admin",tx, reqRequestID)
                if (deleteAllFamilyResults.data === null) {
                    await tx.rollback()
                    content.data = null
                    content.message = "failed update employee"
                    content.statusCode = 400

                    logger.error("failed delete current family", {
                        request_id:reqRequestID,
                        location:"services/employee/employee.updateOneByID",
                        source : "models/employee/family.deleteAllByEmployeeID",
                        method:"updateOneByID",
                    });

                    return content

                }

            }
            for (const family of reqBody.families) {
                let insertFamily = {
                    reqEmployeeID : reqEmployeeID,
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

            runOnPromises.push({
                name:"insertEmployeeFamilyResult",
                promise: employeeFamilyModel.createEmployeeFamilyBulks(insertFamilies, reqEmployeeID, tx, reqRequestID)
            })

        }

        try {
            if (runOnPromises.length > 0) {
                let index = 0
                const results = await Promise.all(runOnPromises.map(p => p.promise));
                for (const result of results) {

                    if (result.data === null) {
                        await tx.rollback()
                        content.message = "failed update employee"

                        logger.error("failed update employee", {
                            request_id:reqRequestID,
                            location:"services/employee/employee.updateOneByID",
                            method:`runOnPromises[${runOnPromises[index].name}]`,
                        });

                        return content

                    }

                    index++

                }

            }
        } catch (error) {
            await tx.rollback();
            content.message = "failed update employee"

            logger.error("error promises", {
                request_id:reqRequestID,
                location:"services/employee/employee.updateOneByID",
                method:"updateOneByID",
                error:{
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                },
            });

            return content;
        }

        await tx.commit()

        content.data = 1
        content.message = "success"
        content.statusCode = 200

    } catch (e) {

        logger.error("failed update employee", {
            request_id:reqRequestID,
            location:"services/employee/employee.updateOneByID",
            method:"updateOneByID",
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


        let employeeResult = await employeeModel.getOneEmployeeByID(reqEmployeeID,tx, reqRequestID)
        if (employeeResult.data === null) {
            await tx.rollback()
            content.data = null
            content.message = "data not found"
            content.statusCode = 404

            return content

        }

        if ((employeeResult.data.deleted_at !== null) || employeeResult.data.deleted_by !== null) {
            await tx.rollback()
            content.data = null
            content.message = "data not found"
            content.statusCode = 404 
            return content
        }

        let results = await employeeModel.deleteOneByID(reqEmployeeID,"admin",tx,reqRequestID)
        if (results.data === null) {
            await tx.rollback()
            content.data = null
            content.message = "data not found"
            content.statusCode = 404

            return content

        }
        
        await tx.commit()

        content.data = results.data
        content.message = "success"
        content.statusCode = 200

    } catch (e) {

        logger.error("failed delete employee", {
            request_id:reqRequestID,
            location:"services/employee/employee.deleteOneByID",
            method:"deleteOneByID",
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

        await tx.commit()

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