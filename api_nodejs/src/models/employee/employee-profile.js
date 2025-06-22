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
    outletAreaSpreadingID= null,
    {
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
    } = {},
    tx = false, reqRequestID = null) => {

    let content = {
        data : null,
        message : "failed"
    }

    if (outletAreaSpreadingID === null) {
        return content
    }

    let dataBinding = [
        reqDistrictID,
        reqVillageID,
        reqCityID,
        reqOwnerOutletName,
        reqAge,
        reqGender,
        reqPhone,
        reqEmail,
        reqOutletName,
        reqLatitude,
        reqLongitude,
        reqAddress,
        reqOutletCategory,
        reqIsUsedAppPos,
        reqAppPosName,
        reqIsCustomerListFB,
        reqDevices,
        reqStoreManagement,
        reqStoreResponse,
        reqStoreCondition,
        reqNote,
        reqReason,
        reqDateFollowUp,
        reqUserID,
        helper.dateTimeDb(),
        outletAreaSpreadingID
    ]

    let sql = `
            UPDATE 
                ${dbNameGrosir}.area_spreading_outlets aso
            SET
                aso.district_id = ?,
                aso.village_id = ?,
                aso.city_id = ?,
                aso.owner_outlet_name = ?,
                aso.age = ?,
                aso.gender = ?,
                aso.phone = ?,
                aso.email = ?,
                aso.outlet_name = ?,
                aso.latitude = ?,
                aso.longitude = ?,
                aso.address = ?,
                aso.outlet_category = ?,
                aso.is_used_app_pos = ?,
                aso.app_pos_name = ?,
                aso.is_customer_list_fb = ?,
                aso.device = ?,
                aso.store_management = ?,
                aso.store_response = ?,
                aso.store_condition = ?,
                aso.notes = ?,
                aso.reason = ?,
                aso.follow_up_date = ?,
                aso.updated_by=?,
                aso.updated_at=?
            WHERE 
                aso.id = ?;

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

        logger.error("Database Error (updateOneByID)", {
            request_id:reqRequestID,
            location:"models/employee/employee.updateOneByID",
            method:"updateOneByID",
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
