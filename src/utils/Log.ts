const { createLogger, format, transports } = require('winston');
import moment = require('moment');
import { Config } from 'config/Configuration';

/**
 * Defines a singleton logging class that logs to the specified
 * transports.
 */
export default class Log {
    private static _instance: Log;
    private logger: any;
    private logFormat: any;

    constructor() {
        let transportConfig = [
            new transports.File({
                filename: Config.logfile,
                dirname: Config.logDir
            }),
            new transports.Console()
        ];

        this.logFormat = format.printf(info => {
            return `${info.timestamp} [${info.level}]: ${info.message}`;
        });

        this.logger = createLogger({
            level: 'debug',
            format: this.logFormat,
            transports: transportConfig
        });
    }
    /**
     * Returns singleton instance of the logger
     */
    public static get Instance(): Log {
        return this._instance || (this._instance = new this());
    }

    /**
     * Logs on a debug level.
     * @param  {string} message - Message to debug
     * @returns void
     */
    debug(message: string): void {
        this.logger.debug(message, {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        });
    }
    /**
     * Logs on an info level.
     * @param  {string} message - Message to log as info
     * @returns void
     */
    info(message: string): void {
        this.logger.info(message, {
            timestamp: moment().format('DD-MM-YYYY HH:mm:ss.SSS')
        })
    }
}
