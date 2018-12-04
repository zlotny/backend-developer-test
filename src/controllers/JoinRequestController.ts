import JoinRequest from "models/JoinRequest";
import GameMatch from "models/GameMatch";
import User from "models/User";

const JoinRequestModel: any = new JoinRequest().getModelForClass(JoinRequest);
const GameMatchModel: any = new GameMatch().getModelForClass(GameMatch);
const UserModel: any = new User().getModelForClass(User);

export default class JoinRequestController {
    public static async listAll(req, res) {
        // TODO: Create user roles and allow admins to do it.
        res.status(403).send({ message: "Listing all requests forbidden" });
        return;
        try {
            let toRet = await JoinRequestModel.find({});
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async create(req, res) {
        try {
            req.body.match = await GameMatchModel.findById(req.body.match._id);
            if (req.body.match === null) {
                res.status(404).send({ message: "Game Match not found" });
                return;
            }
            req.body.source = await UserModel.findById(req.body.source._id);
            if (req.body.source === null) {
                res.status(404).send({ message: "Source user not found" });
                return;
            }
            req.body.destination = await UserModel.findById(req.body.destination._id);
            if (req.body.destination === null) {
                res.status(404).send({ message: "Destination user not found" });
                return;
            }
        } catch (err) {
            res.status(400).send(err);
            return;
        }

        if (req.body.source._id.toString() != req.user._id.toString()) {
            res.status(403).send({ message: "The source user must be you" });
            return;
        }

        if (req.body.destination._id.toString() == req.user._id.toString()) {
            res.status(403).send({ message: "The destination user cannot be you" });
            return;
        }

        if (req.body.match.host._id.toString() == req.user._id.toString()) {
            res.status(403).send({ message: "The match host user cannot be you" });
            return;
        }

        if (req.body.match.host._id.toString() != req.body.destination._id.toString()) {
            res.status(403).send({ message: "The destination for the join request must be the same as the match" });
            return;
        }

        try {
            let toRet = await new JoinRequestModel(req.body).save();
            res.send(toRet);
            return;
        } catch (err) {
            res.status(400).send(err);
            return;
        }
    }

    public static async read(req, res) {
        try {
            let toRet = await JoinRequestModel.findById(req.params.joinRequestId);
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async update(req, res) {
        // TODO: Create user roles and allow admins to do it.
        res.status(403).send({ message: "Modifying requests forbidden" });
        return;
        try {
            let toRet = await JoinRequestModel.findOneAndUpdate({ _id: req.params.joinRequestId }, req.body, { new: true });
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async delete(req, res) {
        let targetRequest = await JoinRequestModel.findById(req.params.joinRequestId);
        try {
            if (!targetRequest) {
                res.status(404).send({ message: 'JoinRequest not found' });
            } else {
                if (targetRequest.source._id.toString() != req.user._id.toString()) {
                    res.status(403).send({ message: "You can only delete a request in which the source is you" });
                    return;
                } else {
                    await JoinRequestModel.findByIdAndRemove(req.params.joinRequestId);
                    res.send({ message: 'JoinRequest successfuly deleted' });
                }
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async listReceivedRequests(req, res) {
        try {
            let toRet = await JoinRequestModel.find({ "destination": req.user });
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async listSentRequests(req, res) {
        try {
            let toRet = await JoinRequestModel.find({ "source": req.user });
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }
}