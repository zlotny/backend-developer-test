import * as Winston from 'winston';
import moment = require('moment');
import { Config } from 'config/Configuration';
import { Format } from 'logform';

/**
 * Defines a singleton logging class that logs to the specified
 * transports.
 */
export default class Log {
    private static _instance: Log;
    private logger: Winston.Logger;
    private logFormat: Format;

    constructor() {
        let transportConfig = [
            new Winston.transports.File({
                filename: Config.logfile,
                dirname: Config.logDir
            }),
            new Winston.transports.Console()
        ];

        this.logFormat = Winston.format.printf(info => {
            return `${info.timestamp} [${info.level}]: ${info.message}`;
        });

        this.logger = Winston.createLogger({
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
