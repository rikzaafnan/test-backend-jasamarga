import express, { json } from "express";
import employeeController from "../controller/employee/employee.js";
import reportEmployeeController from "../controller/report/employee.js";

const apiRouter = new express();

apiRouter.post('/employees' ,employeeController.create)

apiRouter.get('/employees' ,employeeController.findAll)

apiRouter.get('/employees/:employeeID' ,employeeController.getOneByID)

apiRouter.put('/employees/:employeeID' ,employeeController.updateByID)

apiRouter.delete('/employees/:employeeID' ,employeeController.deleteByID)

apiRouter.get('/reports/employees' ,reportEmployeeController.getReport)

export {
    apiRouter
}