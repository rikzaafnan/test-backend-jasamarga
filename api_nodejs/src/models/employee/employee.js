import {sequelize} from "../../application/db/datasource/database.js";
import {logger} from "../../application/logging.js";
import helper from "../../helper/helper.js";
import moment from "moment-timezone";

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
            AND
                e.deleted_at IS NULL
            AND
                e.deleted_by IS NULL
            
            ${sort}

            LIMIT ${filters.limit} OFFSET ${(filters.page)}
        `

    let sqlCount = `
                        SELECT 
                            COUNT(e.id) AS total_count
                        FROM  employee e
                       WHERE
                            1 = 1 
                        AND
                            e.deleted_at IS NULL
                        AND
                            e.deleted_by IS NULL 
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
            WITH educations_cte AS (
                SELECT
                    ed.employee_id,
                    json_agg(jsonb_build_object(
                        'id', ed.id,
                        'name', ed.name,
                        'level', ed.level,
                        'description', ed.description,
                        'created_at', TO_CHAR(ed.created_at, 'YYYY-MM-DD'),
                        'updated_at', TO_CHAR(ed.updated_at, 'YYYY-MM-DD')
                    )) AS educations
                FROM education ed
                where ed.deleted_at IS NULL
                AND ed.deleted_by IS NULL
                GROUP BY ed.employee_id
            ),
            families_cte AS (
                SELECT
                    ef.employee_id,
                    json_agg(jsonb_build_object(
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
                    )) AS families
                FROM employee_family ef
                where ef.deleted_at IS NULL
                AND ef.deleted_by IS NULL
                GROUP BY ef.employee_id
            )
            SELECT
                e.id,
                e.nik,
                e.name,
                e.is_active,
                TO_CHAR(e.start_date, 'YYYY-MM-DD') AS start_date,
                TO_CHAR(e.end_date, 'YYYY-MM-DD') AS end_date,
                e.deleted_at,
                e.deleted_by,
                ep.id AS employee_profile_id,
                ep.place_of_birth,
                TO_CHAR(ep.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
                ep.gender,
                ep.is_married,
                ep.prof_pict,
                TO_CHAR(ep.created_at, 'YYYY-MM-DD') AS created_at,
                TO_CHAR(ep.updated_at, 'YYYY-MM-DD') AS updated_at,
                ep.created_by,
                ep.updated_by,
                COALESCE(ed.educations, '[]') AS educations,
                COALESCE(fa.families, '[]') AS families

            FROM employee e
            JOIN employee_profile ep ON ep.employee_id = e.id
            LEFT JOIN educations_cte ed ON ed.employee_id = e.id
            LEFT JOIN families_cte fa ON fa.employee_id = e.id
            WHERE e.id = ?
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
    {
        reqNIK = null,
        reqName = null,
        reqIsActive = null,
        reqIsStartDate = null,
        reqIsEndDate = null,
        reqCreatedBy =  "admin",
    } = {},
    tx = false, reqRequestID = null) => {

    let content = {
        data : null,
        message : "failed"
    }

    let dataBinding = [
        reqNIK,
        reqName,
        reqIsActive,
        reqIsStartDate,
        reqIsEndDate,
        reqCreatedBy
    ]

    let sql = `
            INSERT INTO 
                employee
            ( nik, name, is_active, start_date, end_date, created_by )
                VALUES (
                        ${dataBinding.map(() => '?').join(', ')}
                    )
            RETURNING id;


    `

    let results, metadata

    try {
        if (tx) {
            [results, metadata] = await sequelize.query(sql,{replacements:dataBinding, transaction: tx });

        } else {
            [results, metadata] = await sequelize.query(sql,{replacements:dataBinding,});
        }

        console.log("results", results)
        console.log("metadata", metadata)

        if (metadata > 0 ) {
            content.data = results[0].id
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
    reqEmployeeID= null,
    {
        reqNIK = null,
        reqName = null,
        reqIsActive = null,
        reqIsStartDate = null,
        reqIsEndDate = null,
        reqUpdatedBy =  "admin",
    } = {},
    tx = false, reqRequestID = null) => {

    let content = {
        data : null,
        message : "failed"
    }

    if (reqEmployeeID === null) {
        return content
    }

     let dataBinding = [
        reqNIK,
        reqName,
        reqIsActive,
        reqIsStartDate,
        reqIsEndDate,
        reqUpdatedBy,
        helper.dateTimeDB(),
        reqEmployeeID
    ]

    let sql = `
            UPDATE 
                employee
            SET
                nik = ?,
                name = ?,
                is_active = ?,
                start_date = ?,
                end_date = ?,
                updated_by = ?,
                updated_at = ?
            WHERE 
                id = ?;

    `

    let result
    let affectedRows

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
    employeeID= null,deletedBy = "admin",
    tx = false, reqRequestID = null) => {

    let content = {
        data : null,
        message : "failed"
    }

    if (employeeID === null) {
        return content
    }

    let dataBinding = [
        deletedBy,
        helper.dateTimeDB(),
        employeeID
    ]

    let sql = `
            UPDATE 
                employee
            SET
                deleted_by = ?,
                deleted_at = ?
            WHERE 
                id = ?
    `

    let result, affectedRows

    try {
       if (tx) {
            [result, affectedRows] = await sequelize.query(sql,{replacements:dataBinding, transaction: tx });

        } else {
            [result, affectedRows] = await sequelize.query(sql,{replacements:dataBinding,});
        }

        if (affectedRows.rowCount > 0) {
            content.data = result.rowCount
            content.message =  "success"
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
