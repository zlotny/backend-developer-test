import JoinRequest from "models/JoinRequest";

const JoinRequestModel: any = new JoinRequest().getModelForClass(JoinRequest);

export default class JoinRequestController {
    public static async listAll(req, res) {
        try {
            let toRet = await JoinRequestModel.find({});
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async create(req, res) {
        try {
            let toRet = await new JoinRequestModel(req.body).save();
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
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
        try {
            let toRet = await JoinRequestModel.findOneAndUpdate({ _id: req.params.joinRequestId }, req.body, { new: true });
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    public static async delete(req, res) {
        try {
            let toRet = await JoinRequestModel.findByIdAndRemove(req.params.joinRequestId);
            if (!toRet) {
                res.status(404).send({ message: 'JoinRequest not found' });
            } else {
                res.send({ message: 'JoinRequest successfuly deleted' });
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }
}