import { Application } from './Application.js';
import { ProcessHandler } from './ProcessHandler.js';
import properties from './Properties.js';
import LogManager from './LogManager.js';

/**
 * This is the entry point of the whole api.
 * <p>
 * Here's where all the components of the api are
 * being intialized.
 * 
 * @author Hanan Twito
 */
try {
    // Getting and intializing the main logger
    const logger = LogManager.init(properties);

    try {
        const application = new Application(properties);
        const processHandler = new ProcessHandler();
        
        // Launch the app
        application.start();
        
        /*
        The process hanler catches event that occured to the
        node process of the os.
        */
        processHandler.handleExit(logger, async () => {
            // Let the application exit gracefully
            await application.close();
        });
    } catch (e) {
        logger.error("Unhandled exception has been thrown by the application:", e);
    }
} catch (e) {
    console.error("Failed to initialize the logger:", e);
}