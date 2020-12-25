import Compression from 'compression';
import Express from 'express';
import LogManager from './LogManager.js'
import Cors from 'cors';
import Helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import API from './API.js';
import BodyParser from 'body-parser';

/**
 * This is the main class of the api.
 * <p>
 * It is wraps the {@link Express} application.
 * 
 * @author Hanan Twito
 */
export class Application {
    constructor(properties) {
        this.properties = properties;
        this.expressApp = Express();
        this.expressApp.use(Compression());
        this.expressApp.use(Helmet());
        this.expressApp.use(Cors());
        // parse application/x-www-form-urlencoded
        this.expressApp.use(BodyParser.urlencoded({ extended: false }))
        // parse application/json
        this.expressApp.use(BodyParser.json())
        this.expressApp.use(RateLimit({
            windowMs: properties.get('security.rate_limit.window'),
            max: properties.get('security.rate_limit.maxRequests')
        }));
        this.loggger = LogManager.bindExpressApp(this.expressApp, properties);
        this.setupErrorHandler();
        this.api = new API();
        this.api.build(this.expressApp, this.properties);
    }

    /**
     * Setting the error handler for the {@link Express} server.
     * 
     * @param logger - logger to record the errors with
     */
    setupErrorHandler(logger) {
        // Handle errors
        this.expressApp.use((err, req, res, next) => {
            // Fallback to default node handler
            if (res.headersSent) {
              next(err);
              return;
            }
          
            logger.error(err.message, {url: req.originalUrl});
          
            res.status(500);
            res.json({ error: err.message });
        });
    }
   
    /**
     * Publishes the api over the node server.
     * <p>
     * The port of the server is taken from the application properties.
     */
    start() {
        const port =  this.properties.get('main.app.port');
        const logger = this.loggger;
        this.server = this.expressApp.listen(port, () => {
            logger.info("The application has been launched on port " + port)
        });
    }

    /**
     * Closes all the sub-services of the application.
     * <p>
     * Including the node server.
     */
    async close() {
        this.server.close();
        await this.loggger.info("The application has been closed");
    }
}
