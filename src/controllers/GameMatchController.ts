import GameMatch from "models/GameMatch";
import User from "models/User";
import Game from "models/Game";
import Express = require('express');

const GameMatchModel: any = new GameMatch().getModelForClass(GameMatch);
const GameModel: any = new Game().getModelForClass(Game);
const UserModel: any = new User().getModelForClass(User);

export default class GameMatchController {

    /**
     * Lists all the game matches
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async listAll(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: Array<typeof GameMatchModel> = await GameMatchModel.find({});
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Creates a game match
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async create(req: any, res: Express.Response): Promise<void> {
        try {
            req.body.game = await GameModel.findById(req.body.game._id);
            req.body.host = await UserModel.findById(req.body.host._id);
        } catch (err) {
            res.status(400).send(err);
            return;
        }

        if (req.body.host.games.filter(gameId => (req.body.game._id.toString() == gameId.toString())).length == 0) {
            res.status(403).send({ message: "You cannot create a match for a game not in your interests" });
            return;
        }

        if (req.body.host._id.toString() != req.user._id.toString()) {
            res.status(403).send({ message: "You can only create matches in which the host is you" })
            return;
        }

        try {
            let toRet: typeof GameMatchModel = await new GameMatchModel(req.body).save();
            res.send(toRet);
            return;
        } catch (err) {
            res.status(400).send(err);
            return;
        }
    }

    /**
     * Retrieves a single game match
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async read(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: typeof GameMatchModel = await GameMatchModel.findById(req.params.gameMatchId);
            res.send(toRet);
            return;
        } catch (err) {
            res.status(400).send(err);
            return;
        }
    }

    /**
     * Updates a game match information
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async update(req: any, res: Express.Response): Promise<void> {
        try {
            req.body.host = await UserModel.findById(req.body.host._id);
            req.body.game = await GameModel.findById(req.body.game._id);
        } catch (err) {
            res.status(400).send(err);
            return;
        }

        if (req.body.host._id.toString() != req.user._id.toString()) {
            res.status(403).send({ message: "You can only edit a match in which the host is you" })
            return;
        }

        try {
            let toRet: typeof GameMatchModel = await GameMatchModel.findOneAndUpdate({ _id: req.params.gameMatchId }, req.body, { new: true });
            res.send(toRet);
            return;
        } catch (err) {
            res.status(400).send(err);
            return;
        }
    }

    /**
     * Deeltes a game match
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async delete(req: any, res: Express.Response): Promise<void> {
        let targetMatch: typeof GameMatchModel = await GameMatchModel.findById(req.params.gameMatchId);
        try {
            if (!targetMatch) {
                res.status(404).send({ message: 'GameMatch not found' });
                return;
            } else {
                if (targetMatch.host._id.toString() != req.user._id.toString()) {
                    res.status(403).send({ message: "You can only delete a match in which the host is you" });
                    return;
                } else {
                    await GameMatchModel.findByIdAndRemove(req.params.gameMatchId);
                    res.send({ message: 'GameMatch successfuly deleted' });
                    return;
                }
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Lists near matches in which the requesting user has an interest
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async listNearMatchesByMyInterests(req: any, res: Express.Response): Promise<void> {
        try {
            let nearUsers: Array<typeof UserModel> = await UserModel.find({
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

            let nearMatches: typeof GameMatchModel = [];

            let nearMatchesInArrayForm: Array<Array<GameMatch>> = await Promise.all(nearUsers.map(async (user) => {
                let matches = await GameMatchModel.find({
                    host: user._id,
                    game: { $in: req.user.games }
                });
                return matches;
            }));

            nearMatchesInArrayForm.forEach((matchArray: Array<any>) => {
                nearMatches.push(...matchArray);
            });

            res.json(nearMatches);
            return;
        } catch (err) {
            res.status(400).send(err);
            return;
        }
    }
}