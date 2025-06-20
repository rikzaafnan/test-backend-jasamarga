import { logger } from "../../logging.js";
import {Sequelize} from "sequelize";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "local") {
    const envFileName = `.env.${process.env.NODE_ENV}`;
    dotenv.config({ path: envFileName });
} else {
    dotenv.config();
}

let sequelize
// Option 3: Passing parameters separately (other dialects)
if (process.env.NODE_ENV !== "local") {
    sequelize = new Sequelize(process.env.DB_COMMAND_CENTER_DATABASE_NAME, process.env.DB_COMMAND_CENTER_USER, process.env.DB_COMMAND_CENTER_PASSWORD, {
        host: process.env.DB_COMMAND_CENTER_HOST,
        port:process.env.DB_COMMAND_CENTER_PORT,
        dialect: 'mysql',
        // logging: msg => logger.info(msg),     // Use custom logger (e.g. Winston or Bunyan), displays the first parameter
        // logging: console.log,     // logging query with console.log
        logging: false     // disable logging query
    });
    
} else {
    sequelize = new Sequelize(process.env.DB_COMMAND_CENTER_DATABASE_NAME, process.env.DB_COMMAND_CENTER_USER, process.env.DB_COMMAND_CENTER_PASSWORD, {
        host: process.env.DB_COMMAND_CENTER_HOST,
        port:process.env.DB_COMMAND_CENTER_PORT,
        dialect: 'mysql',
        logging: msg => logger.info(msg),     // Use custom logger (e.g. Winston or Bunyan), displays the first parameter
        // logging: console.log,     // logging query with console.log
        // logging: false     // disable logging query
    });

}

export  {
    sequelize
}