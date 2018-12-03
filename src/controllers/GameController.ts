import Game from "models/Game";

const GameModel: any = new Game().getModelForClass(Game);

export default class GameController {
    public static async listAll(req, res) {
        try {
            let toRet = await GameModel.find({});
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async create(req, res) {
        // TODO: Create user roles and allow admins to do it.
        res.status(403).send({ message: "Game creation forbidden" });
        return;
        try {
            let toRet = await new GameModel(req.body).save();
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async read(req, res) {
        try {
            let toRet = await GameModel.findById(req.params.gameId);
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async update(req, res) {
        // TODO: Create user roles and allow admins to do it.
        res.status(403).send({ message: "Game editing forbidden" });
        return;
        try {
            let toRet = await GameModel.findOneAndUpdate({ _id: req.params.gameId }, req.body, { new: true });
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async delete(req, res) {
        // TODO: Create user roles and allow admins to do it.
        res.status(403).send({ message: "Game deleting forbidden" });
        return;
        try {
            let toRet = await GameModel.findByIdAndRemove(req.params.gameId);
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