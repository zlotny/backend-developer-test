import Express = require('express');
import Game from "models/Game";

const GameModel: any = new Game().getModelForClass(Game);

export default class GameController {

    /**
     * Lists all games
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async listAll(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: Array<typeof GameModel> = await GameModel.find({});
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Creates a game
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async create(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: typeof GameModel = await new GameModel(req.body).save();
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Retrieves a single game
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async read(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: typeof GameModel = await GameModel.findById(req.params.gameId);
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Updates a game
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async update(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: typeof GameModel = await GameModel.findOneAndUpdate({ _id: req.params.gameId }, req.body, { new: true });
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Deletes a game
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async delete(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: typeof GameModel = await GameModel.findByIdAndRemove(req.params.gameId);
            if (!toRet) {
                res.status(404).send({ message: 'Game not found' });
            } else {
                res.send({ message: 'Game successfuly deleted' });
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }
}