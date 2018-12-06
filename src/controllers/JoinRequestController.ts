import JoinRequest from "models/JoinRequest";
import GameMatch from "models/GameMatch";
import User from "models/User";
import Express = require('express');

const JoinRequestModel: any = new JoinRequest().getModelForClass(JoinRequest);
const GameMatchModel: any = new GameMatch().getModelForClass(GameMatch);
const UserModel: any = new User().getModelForClass(User);

export default class JoinRequestController {

    /**
     * Lists all join requests
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async listAll(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: Array<typeof JoinRequestModel> = await JoinRequestModel.find({});
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Creates a join request
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async create(req: any, res: Express.Response): Promise<void> {
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
            let toRet: typeof JoinRequestModel = await new JoinRequestModel(req.body).save();
            res.send(toRet);
            return;
        } catch (err) {
            res.status(400).send(err);
            return;
        }
    }

    /**
     * Retrieves a single join request
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async read(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: typeof JoinRequestModel = await JoinRequestModel.findById(req.params.joinRequestId);
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Updates a join request
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async update(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: typeof JoinRequestModel = await JoinRequestModel.findOneAndUpdate({ _id: req.params.joinRequestId }, req.body, { new: true });
            res.send(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Deletes a join request
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async delete(req: any, res: Express.Response): Promise<void> {
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

    /**
     * Lists all the requesting user received requests
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async listReceivedRequests(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: Array<typeof JoinRequestModel> = await JoinRequestModel.find({ "destination": req.user, "resolved": false });
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Lists all the requesting user sent requests
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async listSentRequests(req: any, res: Express.Response): Promise<void> {
        try {
            let toRet: Array<typeof JoinRequestModel> = await JoinRequestModel.find({ "source": req.user, "resolved": false });
            res.json(toRet);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Sends a request to a game match
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async sendRequestToGameMatch(req: any, res: Express.Response): Promise<void> {
        let gameMatch: typeof GameMatchModel = await GameMatchModel.findById(req.params.matchId);
        if (gameMatch === null) {
            res.status(404).send({ message: "Match not found" });
            return
        }

        if (gameMatch.host._id.toString() == req.user._id.toString()) {
            res.status(403).send({ message: "You cannot send a request to a game match hosted by you" });
            return;
        }

        let toRet: typeof JoinRequestModel = await new JoinRequestModel({
            source: req.user,
            destination: gameMatch.host,
            match: gameMatch
        }).save();
        res.send(toRet);
    }

    /**
     * Accepts a received request
     * @param  {any} req
     * @param  {Express.Response} res
     * @returns Promise
     */
    public static async acceptRequest(req: any, res: Express.Response): Promise<void> {
        let joinRequest: typeof JoinRequestModel = await JoinRequestModel.findById(req.params.joinRequestId);

        let targetMatch: typeof GameMatchModel = await GameMatchModel.findById(joinRequest.match);

        if (joinRequest === null) {
            res.status(404).send({ message: "Join request not found" });
            return;
        }

        if (joinRequest.resolved) {
            res.status(403).send({ message: "This request is already resolved" });
            return;
        }

        if (joinRequest.destination.toString() != req.user._id.toString()) {
            res.status(403).send({ message: "You cannot accept a request that's not sent to you" });
            return;
        }

        if (targetMatch.host.toString() != req.user._id.toString()) {
            res.status(403).send({ message: "You cannot accept a request for a match not created by you" });
            return;
        }

        // Add the player to the target match
        targetMatch.players.push(joinRequest.source);
        await targetMatch.save();

        // Resolve the request and add the modified match
        joinRequest.resolved = true;
        await joinRequest.save();
        res.send(joinRequest);
    }
}