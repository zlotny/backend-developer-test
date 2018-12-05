import Axios from "axios";
import { Config } from "config/Configuration";

export const injectLocation = async (req: any, res: any, next: any): Promise<any> => {
    let locationData = await Axios.get(
        Config.geoLocationAPIUrl
    );

    req.location = [
        locationData.data.lat,
        locationData.data.lon
    ];

    next();
}