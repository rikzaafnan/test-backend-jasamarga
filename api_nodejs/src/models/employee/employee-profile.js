import {sequelize} from "../../application/db/datasource/database.js";
import {logger} from "../../application/logging.js";
import helper from "../../helper/helper.js";

const createEmployeeProfile = async (
    {
        reqEmployeeID = null,
        reqPlaceOfBirth = null,
        reqDateOfBirth = null,
        reqGender = null,
        reqIsMarried = null,
        reqProfilePicture = null,
        reqCreatedBy =  "admin",
    } = {},
    tx = false, reqRequestID = null) => {

    let content = {
        data : null,
        message : "failed"
    }

    let dataBinding = [
        reqEmployeeID,
        reqPlaceOfBirth,
        reqDateOfBirth,
        reqGender,
        reqIsMarried,
        reqProfilePicture,
        reqCreatedBy
    ]

    let sql = `
            INSERT INTO 
                employee_profile
            ( employee_id, place_of_birth, date_of_birth, gender, is_married, prof_pict, created_by )
                VALUES (
                        ${dataBinding.map(() => '?').join(', ')}
                    )

    `

    let results, metadata

    try {
        if (tx) {
            [results, metadata] = await sequelize.query(sql,{replacements:dataBinding, transaction: tx });

        } else {
            [results, metadata] = await sequelize.query(sql,{replacements:dataBinding,});
        }

        if (metadata > 0 ) {
            content.data = metadata
            content.message = "success"
        }

    } catch (error) {

        logger.error("Database Error (createEmployeeProfile)", {
            request_id:reqRequestID,
            location:"models/employee/employee-profile.createEmployeeProfile",
            method:"createEmployeeProfile",
            error:{
                name: error.name,
                message: error.message,
                stack: error.stack
            },
        });

        content.message = "error";
    }

    return content

}

const updateOneByEmployeeID = async (
    {
        reqEmployeeID = null,
        reqPlaceOfBirth = null,
        reqDateOfBirth = null,
        reqGender = null,
        reqIsMarried = null,
        reqProfilePicture = null,
        reqUpdatedBy =  "admin",
    } = {},
    tx = false, reqRequestID = null) => {

    let content = {
        data : null,
        message : "failed"
    }

    let dataBinding = [
        reqPlaceOfBirth,
        reqDateOfBirth,
        reqGender,
        reqIsMarried,
        reqProfilePicture,
        reqUpdatedBy,
        helper.dateTimeDB(),
        reqEmployeeID

    ]

    let sql = `
            UPDATE 
                employee_profile
            SET
                place_of_birth = ?,
                date_of_birth = ?,
                gender = ?,
                is_married = ?,
                prof_pict = ?,
                updated_by = ?,
                updated_at = ?
            WHERE 
                employee_id = ?;

    `

    let result, affectedRows

    try {
        if (tx) {
            [result, affectedRows] = await sequelize.query(sql,{replacements:dataBinding, transaction: tx });

        } else {
            [result, affectedRows] = await sequelize.query(sql,{replacements:dataBinding,});
        }

        if (affectedRows.rowCount > 0) {
            content.data = affectedRows.rowCount
            content.message =  "success"
        }

    } catch (error) {

        logger.error("Database Error (updateOneByEmployeeID)", {
            request_id:reqRequestID,
            location:"models/employee/employee-profile.updateOneByEmployeeID",
            method:"updateOneByEmployeeID",
            error:{
                name: error.name,
                message: error.message,
                stack: error.stack
            },
        });

        content.message = "error";
    }

    return content

}

const deleteOneByEmployeeID = async (
    employeeID= null,
    tx = false, reqRequestID = null) => {

    let content = {
        data : null,
        message : "failed"
    }

    if (employeeID === null) {
        return content
    }

    let dataBinding = [
        "admin",
        helper.dateTimeDb(),
        employeeID
    ]

    let sql = `
            UPDATE 
                employee e
            SET
                deleted_by = ?,
                deleted_at = ?
            WHERE 
                e.id = ?;
    `

    let results
    let metadata

    try {
        if (tx) {
            [results, metadata] = await sequelize.query(sql,{replacements:dataBinding, transaction: tx });

        } else {
            [results, metadata] = await sequelize.query(sql,{replacements:dataBinding,});
        }

        if (results.affectedRows > 0 ) {
            content.data = results.affectedRows
            content.message = "success"
        }

    } catch (error) {

        logger.error("Database Error (deleteOneByID)", {
            request_id:reqRequestID,
            location:"models/employee/employee.deleteOneByID",
            method:"deleteOneByID",
            error:{
                name: error.name,
                message: error.message,
                stack: error.stack
            },
        });

        content.message = "error";
    }

    return content

}

export default {
    createEmployeeProfile, updateOneByEmployeeID, deleteOneByEmployeeID
}
