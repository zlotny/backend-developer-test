import { Router, Request, Response } from 'express';
import JoinRequestController from 'controllers/JoinRequestController';
import { denyToRegularUsers } from 'middleware/Auth';

const router: Router = Router();

router.route('/')
    .get(denyToRegularUsers, JoinRequestController.listAll)
    .post(JoinRequestController.create);

router.route("/received")
    .get(JoinRequestController.listReceivedRequests);

router.route("/sent")
    .get(JoinRequestController.listSentRequests);

router.route('/:joinRequestId')
    .get(JoinRequestController.read)
    .put(denyToRegularUsers, JoinRequestController.update)
    .delete(JoinRequestController.delete);

router.route("/send/:matchId")
    .post(JoinRequestController.sendRequestToGameMatch);

router.route("/accept/:joinRequestId")
    .put(JoinRequestController.acceptRequest);

export const JoinRequestRouter: Router = router;