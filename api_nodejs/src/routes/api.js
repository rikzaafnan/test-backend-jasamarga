import express, { json } from "express";

const apiRouter = new express();

apiRouter.post('/employees' ,(req, res, next) => {
    res.status(201).json({
        status: "201",
        message: "post employees",
        content:[]
    })
})

apiRouter.get('/employees' ,(req, res, next) => {
    res.status(200).json({
        status: "200",
        message: "get employees",
        content:[]
    })
})

apiRouter.get('/employees/:employeeID' ,(req, res, next) => {
    res.status(200).json({
        status: "200",
        message: "get employe by id",
        content:[]
    })
})

apiRouter.put('/employees/:employeeID' ,(req, res, next) => {
    res.status(200).json({
        status: "200",
        message: "update employe by id",
        content:[]
    })
})

apiRouter.delete('/employees/:employeeID' ,(req, res, next) => {
    res.status(200).json({
        status: "200",
        message: "delete employe by id",
        content:[]
    })
})

apiRouter.get('/employe-reports' ,(req, res, next) => {
    res.status(200).json({
        status: "200",
        message: "report all employees",
        content:[]
    })
})

export {
    apiRouter
}