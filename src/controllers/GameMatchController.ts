import GameMatch from "models/GameMatch";
import User from "models/User";
import Game from "models/Game";

const GameMatchModel: any = new GameMatch().getModelForClass(GameMatch);
const GameModel: any = new Game().getModelForClass(Game);
const UserModel: any = new User().getModelForClass(User);

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
            let toRet = await new GameMatchModel(req.body).save();
            res.send(toRet);
            return;
        } catch (err) {
            res.status(400).send(err);
            return;
        }
    }

    public static async read(req, res) {
        try {
            let toRet = await GameMatchModel.findById(req.params.gameMatchId);
            res.send(toRet);
            return;
        } catch (err) {
            res.status(400).send(err);
            return;
        }
    }

    public static async update(req, res) {
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
            let toRet = await GameMatchModel.findOneAndUpdate({ _id: req.params.gameMatchId }, req.body, { new: true });
            res.send(toRet);
            return;
        } catch (err) {
            res.status(400).send(err);
            return;
        }
    }

    public static async delete(req, res) {
        let targetMatch = await GameMatchModel.findById(req.params.gameMatchId);
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

    public static async listNearMatchesByMyInterests(req, res) {
        try {
            // First query near users (not me), then get matches created by them 
            // and compatible by taste. Also not filled out... yeez. this gun'be slow
            let nearUsers = await UserModel.find({
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

            let nearMatches = [];

            let nearMatchesInArrayForm = await Promise.all(nearUsers.map(async (user) => {
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