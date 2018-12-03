import GameMatch from "models/GameMatch";

const GameMatchModel: any = new GameMatch().getModelForClass(GameMatch);

export default class GameMatchController {
    public static async listAll(req, res) {
        try {
            let toRet = await GameMatchModel.find({});
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async create(req, res) {
        try {
            let toRet = await new GameMatchModel(req.body).save();
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async read(req, res) {
        try {
            let toRet = await GameMatchModel.findById(req.params.gameMatchId);
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async update(req, res) {
        try {
            let toRet = await GameMatchModel.findOneAndUpdate({ _id: req.params.gameMatchId }, req.body, { new: true });
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async delete(req, res) {
        try {
            let toRet = await GameMatchModel.findByIdAndRemove(req.params.gameMatchId);
            if (!toRet) {
                res.status(404).send({ message: 'GameMatch not found' });
            } else {
                res.send({ message: 'GameMatch successfuly deleted' });
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }
}