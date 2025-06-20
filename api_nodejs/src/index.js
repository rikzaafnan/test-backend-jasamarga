import {web} from "./application/web.js";
import {logger} from "./application/logging.js";
import dotenv from "dotenv";

dotenv.config();

let env = process.env.NODE_ENV || 'development';
let environment = env



// to get and create data global
globalAccess()

let port            = (process.env.APP_PORT || 4040)
let version         = (process.env.APP_VERSION || 'N/A')

web.listen(port, () => {
    logger.info(`App start on env ${environment}`);
    logger.info(`App start on version ${version}`);
    logger.info(`App start on port ${port}`);
});

function globalAccess() {
    global.env = env;
    global.jwtKeyAccessToken = process.env.JWT_KEY_ACCESS_TOKEN;
    global.jwtKeyRefreshToken = process.env.JWT_KEY_REFRESH_TOKEN;
    global.__basePath = process.cwd();
    global.__basePathSRC = process.cwd()+"/src";
}