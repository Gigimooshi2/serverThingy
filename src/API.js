import { DatabaseService } from "./services/DatabaseService.js"
import SoldierRoute from './routes/SoldierRoute.js';
import {SoldierModel}  from './models/SoldierModel.js';
import {WaitingSoldiersQueue} from './models/WaitingSoldiersQueue.js'

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

        WaitingSoldiersQueue.initialize(DatabaseService.getSequelize());
        WaitingSoldiersQueue.sync();
        WaitingSoldiersQueue.createStages(5);
        // Init routes
        app.use("/soldiers", SoldierRoute);
    }
}