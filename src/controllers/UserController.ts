import User from "models/User";
import Express = require('express');

const UserModel: any = new User().getModelForClass(User);

export default class UserController {

    /**
     * Lists all the users.
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async listAll(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: Array<typeof UserModel> = await UserModel.find({}).select("-token");
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Creates an user from request data
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async create(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: typeof UserModel = await new UserModel(req.body).save();
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Retrieves a single user
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async read(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: typeof UserModel = await UserModel.findById(req.params.userId).select("-token");
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Modifies an user
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async update(req: any, res: Express.Response): Promise<void> {
        if (req.body.games) {
            res.status(403).send({ message: "You cant modify the game list from here. Please use the specific API method for that" });
            return;
        }

        try {
            if (req.user._id != req.params.userId) {
                res.status(403).send({ message: "Editing an user that is not you is forbidden" });
            } else {
                let toRet: typeof UserModel = await UserModel.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true });
                res.send(toRet);
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Deletes an user
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async delete(req: any, res: Express.Response): Promise<void> {
        try {
            if (req.user._id != req.params.userId) {
                res.status(403).send({ message: "Deleting an user that is not you is forbidden" });
                return;
            }

            let toRet: typeof UserModel = await UserModel.findByIdAndRemove(req.params.userId);

            if (!toRet) {
                res.status(404).send({ message: 'User not found' });
            } else {
                res.send({ message: 'User successfuly deleted' });
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Adds a game to the interests of the user making the request
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async addGameToUserInterests(req: any, res: Express.Response): Promise<void> {
        if (req.params.userId != req.user._id.toString()) {
            res.status(403).send({ message: "You can't add games to a user that is not you" });
            return;
        }

        let alreadyHasGame: boolean = req.user.games.some((gameId) => {
            return gameId.toString() == req.params.gameId;
        });

        if (alreadyHasGame) {
            res.status(403).send({ message: "You cannot add a game you already have in your interests" });
            return;
        }

        try {
            req.user.games.push(req.params.gameId);
            await req.user.save();
            res.send(req.user);
        } catch (err) {
            res.status(400).send(err);
        }

    }

    /**
     * Deletes a game from the interests of the user making the request
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async deleteGameFromUserInterests(req: any, res: Express.Response): Promise<void> {
        if (req.params.userId != req.user._id.toString()) {
            res.status(403).send({ message: "You can't delete games from a user that is not you" });
            return;
        }

        let alreadyHasGame: boolean = req.user.games.some((gameId) => {
            return gameId.toString() == req.params.gameId;
        });

        if (!alreadyHasGame) {
            res.status(403).send({ message: "You cannot delete a game you don't have in your interests" });
            return;
        }

        try {
            req.user.games = req.user.games.filter((gameId) => {
                return gameId.toString() != req.params.gameId;
            });
            await req.user.save();
            res.send(req.user);
        } catch (err) {
            res.status(400).send(err);
        }

    }

    /**
     * Lists near (GPS Location) users with the same interests
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async listNearUsersWithMyInterests(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: Array<typeof UserModel> = await UserModel.find({
                _id: { $ne: req.user._id },
                games: { $in: req.user.games },
                location: {
                    $near:
                    {
                        $geometry:
                        {
                            type: "Point",
                            coordinates: req.user.location
                        },
                        $maxDistance: Number(req.params.maxDistance)
                    }
                }
            }).select("-token").sort('location');
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Gets the user model for the user making the requests.
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async getOwnInformation(req: any, res: Express.Response): Promise<void> {
        let toRet: typeof UserModel = await UserModel.findById(req.user._id).select('-token');
        res.send(toRet);
    }
}