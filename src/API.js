import { DatabaseService } from "./services/DatabaseService.js"
import { router as SoldierRoute } from './routes/SoldierRoute.js';
import ArrivalQueueRoute from './routes/ArrivalQueueRoute.js';
import StageDedicatedQueueRoute from './routes/StageDedicatedQueueRoute.js';
import CountDownRoute from './routes/CountDownRoute.js';
import CPRStagesRoute from './routes/CPRStagesRoute.js';
import { CPRStageModel } from './models/CRPStagesModel.js';
import { SoldierModel } from './models/SoldierModel.js';
import { StageDedicatedQueue } from './models/StageDedicatedQueue.js'
import { SoldierArrivalQueue } from "./models/SoldierArrivalQueue.js";
import { CPRCountDownModel } from "./models/CPRCountDownModel.js";

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

        await SoldierArrivalQueue.initialize(DatabaseService.getSequelize());
        await SoldierArrivalQueue.sync();

        await StageDedicatedQueue.initialize(DatabaseService.getSequelize());
        await StageDedicatedQueue.sync()
        await StageDedicatedQueue.createStages(5);


        await CPRStageModel.initialize(DatabaseService.getSequelize());
        await CPRStageModel.sync()
        await CPRStageModel.createStages(5);

        await CPRCountDownModel.initialize(DatabaseService.getSequelize());
        await CPRCountDownModel.sync();
        //     for(let i = 0; i<=200; i++)
        //     {
        //     await SoldierArrivalQueue
        //   .create({
        //     soldierId: i,
        //     turnPos: i
        //   });}
        // Init routes
        app.use("/", SoldierRoute);
        app.use("/", ArrivalQueueRoute);
        app.use("/", StageDedicatedQueueRoute);
        app.use("/", CountDownRoute);
        // app.use("/", CPRStagesRoute);
    }
}