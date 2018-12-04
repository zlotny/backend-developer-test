import User from "models/User";

const UserModel: any = new User().getModelForClass(User);

export default class UserController {
    public static async listAll(req, res) {
        try {
            let toRet = await UserModel.find({});
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async create(req, res) {
        // TODO: Create user roles and allow admins to do it.
        res.status(403).send({ message: "User creation forbidden" });
        return;
        try {
            let toRet = await new UserModel(req.body).save();
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async read(req, res) {
        try {
            let toRet = await UserModel.findById(req.params.userId);
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async update(req, res) {
        if (req.body.games) {
            res.status(403).send({ message: "You cant modify the game list from here. Please use the specific API method for that" });
            return;
        }

        try {
            if (req.user._id != req.params.userId) {
                res.status(403).send({ message: "Editing an user that is not you is forbidden" });
                return;
            }
            let toRet = await UserModel.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true });
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async delete(req, res) {
        try {
            if (req.user._id != req.params.userId) {
                res.status(403).send({ message: "Deleting an user that is not you is forbidden" });
                return;
            }
            let toRet = await UserModel.findByIdAndRemove(req.params.userId);
            if (!toRet) {
                res.status(404).send({ message: 'User not found' });
            } else {
                res.send({ message: 'User successfuly deleted' });
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async addGameToUserInterests(req, res) {
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

        req.user.games.push(req.params.gameId);
        await req.user.save();
        res.send(req.user);
    }

    public static async deleteGameFromUserInterests(req, res) {
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

        req.user.games = req.user.games.filter((gameId) => {
            return gameId.toString() != req.params.gameId;
        });
        await req.user.save();
        res.send(req.user);
    }
}