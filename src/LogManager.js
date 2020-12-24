import winston from 'winston';
import Moragn from 'morgan';

const { createLogger, format, transports } = winston;
const formatParams = (info) => {
    const { timestamp, level, message, ...args } = info;
    // TODO: time zone should be as computer for timestamps
    const ts = timestamp.slice(0, 19).replace("T", " ");
    return `${ts} ${level}: ${message} ${Object.keys(args).length
        ? JSON.stringify(args, "", ""): ""}`;
};
const developmentFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(formatParams));
const productionFormat = format.combine(
    format.timestamp(),
    format.align(),
    format.printf(formatParams));

/**
 * The log manager holds the 
 */
export default class LogManager {
    static logger;

    static getLoggerInstance(properties) {
        if (LogManager.logger == undefined) {
            const logLevel = properties.get('logging.winston.level');
            const dir = properties.get('logging.winston.dir');

            if (process.env.NODE_ENV.trim() != "production") {
                LogManager.logger = createLogger({
                    level: logLevel,
                    format: developmentFormat,
                    exitOnError: false,
                    transports: [new transports.Console()]
                });
            } else {
                LogManager.logger = createLogger({
                    level: logLevel,
                    format: productionFormat,
                    exitOnError: false,
                    transports: [
                        new transports.File({
                            filename:  dir + "error.log",
                            level: "error"
                        }),
                        new transports.File({ filename: dir + "combined.log" })
                    ]
                });
            }
        }

        return LogManager.logger;
    }

    static bindExpressApp(expressApp, properties) {
        // Init in case the log manager hasn't been initalized yet
        LogManager.getLoggerInstance(properties);

        LogManager.logger.errStream = {
            write: function(message, encoding){
                logger.error(message);
            }
        };
        LogManager.logger.infoStream = {
            write: function(message, encoding){
                logger.info(message);
            }
        };

        const format = properties.get('logging.morgan.format');
        
        expressApp.use(
            Moragn(format, {
              skip: function(req, res) {
                return res.statusCode < 400;
              },
              stream: LogManager.logger.errStream
            })
        );
        expressApp.use(
            Moragn(format, {
              skip: function(req, res) {
                return res.statusCode >= 400;
              },
              stream: LogManager.logger.infoStream
            })
        );

        return LogManager.logger;
    }
}