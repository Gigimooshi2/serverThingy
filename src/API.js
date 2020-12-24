import { DatabaseService } from "./services/DatabaseService.js"
import AuthRoute from './routes/AuthRoute.js';
import {SoldierModel}  from './models/SoldierModel.js';

export default class API {
    /**
     * This method should start the building of the API over
     * the express application.
     * <p>
     * All routes, middlewares and services should be intialized
     * from here.
     * 
     * @param {Express} app the express applicaiton to build the api over
     * @param {Properties} properties the properties of the application
     */
    build(app, properties) {
        // Init services
        DatabaseService.init(properties)

        // Init db models
        SoldierModel.initialize(DatabaseService.getSequelize());
        SoldierModel.sync();

        // Init routes
        app.use(AuthRoute);
    }
}