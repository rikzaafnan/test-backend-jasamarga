import express from "express";
import {publicRouter} from "../routes/public-api.js";
import {errorMiddleware} from "../middleware/error-middleware.js";
import { loggingMiddleware } from "../middleware/logging-middleware.js";
import { apiRouter } from "../routes/api.js";

import bodyParser from 'body-parser'
import cors from 'cors'

export const web = express();
web.use(express.json());
web.use(bodyParser.json());
web.use(bodyParser.urlencoded({ extended: true }));
web.use(cors());
web.use(loggingMiddleware)

web.use("/api/v1",publicRouter);
web.use("/api/v1",apiRouter);

web.use('*', (req, res) => res.status(404).json({
    status: "404",
    message: "not found",
    content:[]
}));


web.use(errorMiddleware);