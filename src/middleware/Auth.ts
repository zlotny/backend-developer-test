import User from "models/User";
import Express = require('express');

const UserModel: any = new User().getModelForClass(User);

export default class AuthMiddleware {

    /**
     * Ensures the user making the request has a valid token and injects the user instance on the
     * request object for further use on controller methods/
     * 
     * @param  {any} req - The request sent to the server
     * @param  {Express.Response} res - The Response object
     * @param  {Express.NextFunction} next - Function to continue middleware chain
     * @returns Promise
     */
    public static async requiresAuth(req: any, res: Express.Response, next: Express.NextFunction): Promise<void> {
        // Check if an user with the provided token exists
        let user: typeof UserModel = await UserModel.findOne({
            token: req.token
        }).select("-token");

        // Inject the user in the request object if it exists
        if (user !== null) {
            req.user = user;
            next();
        } else {
            res.status(403).send({
                message: 'Unauthorized',
                details: 'The provided token does not match any users on the platform'
            });
        }
    }

    /**
     * Denies access to the target controller method by checking if an user has
     * an admin flag.
     * 
     * @param  {any} req - The request sent to the server
     * @param  {Express.Response} res - The Response object
     * @param  {Express.NextFunction} next - Function to continue middleware chain
     * @returns Promise
     */
    public static async denyToRegularUsers(req: any, res: Express.Response, next: Express.NextFunction): Promise<void> {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).send({ message: "Method forbidden for regular users" });
        }
    }
}