const ERR_EXIT_CODE = 1;

export class ProcessHandler {
    handleExit(logger, onExit) {
        // So the program won't close instantly
        process.stdin.resume();

        /**
         * The 'exit' event is emitted when the Node.js process is
         * about to exit as a result of either:
         *  - The process.exit() method being called explicitly;
         *  - The Node.js event loop no longer having any additional work to perform.
         */
        process.on('exit', (code) => {
            logger.info('Process exit event with code: ', code);
            onExit();
            process.exit(code);
        });

        // Catch signals to the process
        const singnalHandler = (signal) => {
            logger.info(`Received signal ${signal}`);
            onExit();
            process.exit(ERR_EXIT_CODE);
        }

        process.on('SIGINT', singnalHandler);
        process.on('SIGTERM', singnalHandler);
        process.on('SIGUSR1', singnalHandler);
        process.on('SIGUSR2', singnalHandler);

        /** 
         * The 'uncaughtException' event is emitted when an uncaught JavaScript
         * exception bubbles all the way back to the event loop. 
         */
        process.on('uncaughtException', (err, origin) => {
            logger.error( `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
            onExit();
            process.exit(ERR_EXIT_CODE);
        });

        
        /**
         * The 'unhandledRejection' event is emitted whenever a Promise
         * is rejected and no error handler is attached to the promise 
         * within a turn of the event loop. 
         */
        process.on('unhandledRejection', (reason, promise) => {
            logger.error(`Unhandled Rejection at:${reason.stack || reason}`);
            onExit();
            process.exit(ERR_EXIT_CODE);
        });
    }
}