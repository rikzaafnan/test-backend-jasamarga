import express, { json } from "express";
import employeeController from "../controller/employee/employee.js";

const apiRouter = new express();

apiRouter.post('/employees' ,employeeController.create)

apiRouter.get('/employees' ,employeeController.findAll)

apiRouter.get('/employees/:employeeID' ,employeeController.getOneByID)

apiRouter.put('/employees/:employeeID' ,employeeController.updateByID)

apiRouter.delete('/employees/:employeeID' ,employeeController.deleteByID)

apiRouter.get('/reports/employees' ,(req, res, next) => {
    res.status(200).json({
        status: "200",
        message: "report all employees",
        content:[]
    })
})

export {
    apiRouter
}