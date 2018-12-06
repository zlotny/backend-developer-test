import Axios from "axios";
import { Config } from "config/Configuration";
import Express = require('express');

export default class LocationMiddleware {

    /**
     * @param  {any} req - The request sent to the server
     * @param  {Express.Response} res - The Response object
     * @param  {Express.NextFunction} next - Function to continue middleware chain
     * @returns Promise
     */
    public static async injectLocation(req: any, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let locationData: any = await Axios.get(
            Config.geoLocationAPIUrl
        );

        req.location = [
            locationData.data.lat,
            locationData.data.lon
        ];

        next();
    }
}