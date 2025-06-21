import response from "../../helper/response.js";
import {logger} from "../../application/logging.js";
import Joi from 'joi'
import validateJoi 	from '../../validation/validation.js'
import employeeSvc from "../../services/employee/employee.js";

const findAll = async(req, res, next) => {
    try {

        const validationReq = Joi.object({
            page: Joi.number().default(1).optional(),
            limit: Joi.number().default(5).optional(),
            sort: Joi.string().default('id').optional(),
            order: Joi.string().default('desc').optional(),
        });

        let validationData = validateJoi.validateReq(validationReq, req.query)

        let filters = {
            page : (parseInt(validationData.page) - 1) * parseInt(validationData.limit),
            limit : parseInt(validationData.limit),
            sortBy : validationData.sort,
            sortOrder : validationData.order,
        }

        let results = await employeeSvc.findAllEmployees({reqFilters:filters, reqRequestID:req.requestId})
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
            content : results.data.content,
            message : "success",
            totalData : parseInt(results.data.total_data),
            totalContent : results.data.content.length,
            page:filters.page,
            limit:filters.limit,
            sort:null,
            filter:null
        }

        res.status(responseParams.status).json(response.successResponse(responseParams));
    } catch (e) {

        logger.error("failed get all employee", {
            request_id:req.requestId,
            location:"controller/employee/employee.findAll",
            method:"findAll",
            error:{
                name: e.name,
                message: e.message,
                stack: e.stack
            },
        });

        next(e);
    }
}

const create = async(req, res, next) => {
    try {

        let responseParams={
            status : 200,
            content : [],
            message : "success",
        }

        res.status(responseParams.status).json(response.successResponse(responseParams));
    } catch (e) {

        logger.error("failed create employee", {
            request_id:req.requestId,
            location:"controller/employee/employee.create",
            method:"create",
            error:{
                name: e.name,
                message: e.message,
                stack: e.stack
            },
        });

        next(e);
    }
}

const getOneByID = async(req, res, next) => {
    try {

        const validationReq = Joi.object({
            employeeID: Joi.number().required(),
        });

        let validationData = validateJoi.validateReq(validationReq, req.params)

        let results = await employeeSvc.getOneByID({reqEmployeeID:validationData.employeeID, reqRequestID:req.requestId})
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
            content :results.data,
            message : "success",
        }

        res.status(responseParams.status).json(response.successResponse(responseParams));
    } catch (e) {

        logger.error("failed get detail employee", {
            request_id:req.requestId,
            location:"controller/employee/employee.getOneByID",
            method:"getOneByID",
            error:{
                name: e.name,
                message: e.message,
                stack: e.stack
            },
        });

        next(e);
    }
}

const updateByID = async(req, res, next) => {
    try {

        const validationReq = Joi.object({
            employeeID: Joi.number().required(),
        });

        let validationData = validateJoi.validateReq(validationReq, req.params)

         let responseParams={
            status : 200,
            content :[],
            message : "success",
        }


        res.status(responseParams.status).json(response.successResponse(responseParams));
    } catch (e) {

        logger.error("failed update employee by id", {
            request_id:req.requestId,
            location:"controller/employee/employee.updateByID",
            method:"updateByID",
            error:{
                name: e.name,
                message: e.message,
                stack: e.stack
            },
        });

        next(e);
    }
}

const deleteByID = async(req, res, next) => {
    try {

        let employeeID = parseInt(req.params.employeeID);

        let responseParams={
            status : 200,
            content : [],
            message : "success update data outlet spreading",
        }

        res.status(responseParams.status).json(response.successResponse(responseParams));
    } catch (e) {

        logger.error("failed delewte employee by id", {
            request_id:req.requestId,
            location:"controller/employee/employee.deleteByID",
            method:"deleteByID",
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
    findAll, create, updateByID, deleteByID, getOneByID
}