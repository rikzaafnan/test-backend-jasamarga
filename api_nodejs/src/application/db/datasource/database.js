import { logger } from "../../logging.js";
import {Sequelize} from "sequelize";

let sequelize
// Option 3: Passing parameters separately (other dialects)
if (process.env.NODE_ENV !== "local") {
    sequelize = new Sequelize(process.env.DB_DATABASE_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port:process.env.DB_PORT,
        dialect: 'postgres',
        logging: false     // disable logging query
    });
    
} else {
    sequelize = new Sequelize(process.env.DB_DATABASE_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port:process.env.DB_PORT,
        dialect: 'postgres',
        logging: msg => logger.info(msg),     // Use custom logger (e.g. Winston or Bunyan), displays the first parameter
    });

}

export  {
    sequelize
}