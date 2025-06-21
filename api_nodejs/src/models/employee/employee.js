import {sequelize} from "../../application/db/datasource/database.js";
import {logger} from "../../application/logging.js";
import helper from "../../helper/helper.js";

const findAllEmployee = async (filters = null,tx = false, reqRequestID = null) => {

    let content = {
        data : null,
        message : "failed"
    }

    let dataBinding = []

    let sort = ''
    if ((filters.sortBy !== '') && (filters.sortOrder !== '')) {
        sort = `ORDER BY ${filters.sortBy} ${filters.sortOrder}`
    }

    let sql = `
            SELECT
                e.id as id, e.nik as nik, e.name as name, e.is_active as is_active,
                TO_CHAR(e.start_date, 'YYYY-MM-DD') AS start_date,TO_CHAR(e.end_date, 'YYYY-MM-DD') AS end_date
            FROM
                employee e
            WHERE
               1 = 1 
            
            ${sort}

            LIMIT ${filters.limit} OFFSET ${(filters.page)}
        `

    let sqlCount = `
                        SELECT 
                            COUNT(e.id) AS total_count
                        FROM  employee e
                        WHERE
                            1 = 1 
                        `;

    let results
    let metadata

    try {
        if (tx) {
            [results, metadata] = await sequelize.query(sql,{replacements:dataBinding, transaction: tx });

        } else {
            [results, metadata] = await sequelize.query(sql,{replacements:dataBinding,});
        }

        let [countResults, countMetadata] = await sequelize.query(sqlCount,{replacements:dataBinding,});

        if (results.length > 0 ) {
            content.data = {
                content : results,
                total_data: countResults[0].total_count
            }

            content.message = "success"
        }

    } catch (error) {

        logger.error("Database Error (findAllEmployee)", {
            request_id:reqRequestID,
            location:"models/employee/employee.findAllEmployee",
            method:"findAllEmployee",
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

const getOneEmployeeByID = async (employeeID= null,tx = false, reqRequestID = null) => {

    let content = {
        data : null,
        message : "failed"
    }

    if (employeeID === null) {
        return content
    }

    let dataBinding = [employeeID]

    let sql = `
            SELECT
                e.id as id, e.nik as nik, e.name as name, e.is_active as is_active,
                TO_CHAR(e.start_date, 'YYYY-MM-DD') AS start_date,TO_CHAR(e.end_date, 'YYYY-MM-DD') AS end_date,
                ep.id as employee_profile_id, ep.place_of_birth as place_of_birth, TO_CHAR(ep.date_of_birth, 'YYYY-MM-DD') as date_of_birth,
                ep.gender as gender, ep.is_married as is_married,ep.prof_pict as prof_pict,TO_CHAR(ep.created_at, 'YYYY-MM-DD') as created_at,TO_CHAR(ep.updated_at, 'YYYY-MM-DD') as updated_at,ep.created_by as created_by,ep.updated_by as updated_by,
                COALESCE(
                    json_agg(
                        jsonb_build_object(
                            'id', ed.id,
                            'name', ed.name,
                            'level', ed.level,
                            'description', ed.description,
                            'created_at', TO_CHAR(ed.created_at, 'YYYY-MM-DD'),
                            'updated_at', TO_CHAR(ed.updated_at, 'YYYY-MM-DD')
                        )
                    ) FILTER (WHERE ed.id IS NOT NULL),
                    '[]'
                ) AS educations,
                COALESCE(
                    json_agg(
                        jsonb_build_object(
                            'id', ef.id,
                            'name', ef.name,
                            'identifier', ef.identifier,
                            'job', ef.job,
                            'religion', ef.religion,
                            'is_life', ef.is_life,
                            'is_divorced', ef.is_divorced,
                            'relation_status', ef.relation_status,
                            'place_of_birth', ef.place_of_birth,
                            'date_of_birth', TO_CHAR(ef.date_of_birth, 'YYYY-MM-DD'),
                            'created_at', TO_CHAR(ef.created_at, 'YYYY-MM-DD'),
                            'updated_at', TO_CHAR(ef.updated_at, 'YYYY-MM-DD')
                        )
                    ) FILTER (WHERE ef.id IS NOT NULL),
                    '[]'
                ) AS families
            FROM
                employee e
            JOIN 
                employee_profile ep ON e.id = ep.employee_id
            LEFT JOIN
                education ed ON e.id = ed.employee_id
            LEFT JOIN
                employee_family ef ON e.id = ef.employee_id
            WHERE
               e.id = ?
            GROUP BY
            e.id, ep.id

        `

    let results
    let metadata

    try {
        if (tx) {
            [results, metadata] = await sequelize.query(sql,{replacements:dataBinding, transaction: tx });

        } else {
            [results, metadata] = await sequelize.query(sql,{replacements:dataBinding,});
        }

        if (results.length > 0 ) {
            content.data = results[0]
            content.message = "success"
        }

    } catch (error) {

        logger.error("Database Error (getOneEmployeeByID)", {
            request_id:reqRequestID,
            location:"models/employee/employee.getOneEmployeeByID",
            method:"getOneEmployeeByID",
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

const createEmployee = async (
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

        logger.error("Database Error (createEmployee)", {
            request_id:reqRequestID,
            location:"models/employee/employee.createEmployee",
            method:"createEmployee",
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

const updateOneByID = async (
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



const deleteOneByID = async (
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
    findAllEmployee, getOneEmployeeByID, updateOneByID, deleteOneByID, createEmployee
}
