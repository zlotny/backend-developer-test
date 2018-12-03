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
}