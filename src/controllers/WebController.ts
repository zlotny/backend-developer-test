import Express = require('express');

export default class WebController {

    /**
     * Renders a landing page with some info, social login buttons and a link
     * to the API documentation.
     * @param  {Express.Request} req - Request sent to the server
     * @param  {Express.Response} res - Response from the server
     * @returns Promise
     */
    public static async landing(req: Express.Request, res: Express.Response): Promise<void> {
        res.render('home');
    }
}