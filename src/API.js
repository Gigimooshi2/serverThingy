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
    async build(app, properties) {
        // Init services
        await DatabaseService.init(properties)

        // Init db models
        await SoldierModel.initialize(DatabaseService.getSequelize());
        await SoldierModel.sync();

        await WaitingSoldiersQueue.initialize(DatabaseService.getSequelize());
        await WaitingSoldiersQueue.sync();
        await WaitingSoldiersQueue.createStages(5);
        // Init routes
        app.use("/soldiers", SoldierRoute);
    }
}