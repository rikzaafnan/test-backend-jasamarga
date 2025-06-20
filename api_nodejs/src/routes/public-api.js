import express, { json } from "express";
import { loggingMiddleware } from "../middleware/logging-middleware.js";

const publicRouter = new express.Router();

publicRouter.get('/ping', (req, res, next) => {
    res.status(200).json({
        status: "200",
        message: "pesan dari ping",
        content:[]
    })
})

export {
    publicRouter
}