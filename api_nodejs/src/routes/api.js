import express, { json } from "express";
import authMiddleware from "../middleware/auth-middleware.js";

const apiRouter = new express();
apiRouter.use(authMiddleware.authenticateAccessToken)

apiRouter.get('/ping' ,(req, res, next) => {
    res.status(200).json({
        status: "200",
        message: "hello with JWT",
        content:[]
    })
})

export {
    apiRouter
}