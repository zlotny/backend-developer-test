import { Router, Request, Response } from 'express';
import UserController from 'controllers/UserController';
import { denyToRegularUsers } from 'middleware/Auth';

const router: Router = Router();

router.route('/')
    .get(UserController.listAll)
    .post(denyToRegularUsers, UserController.create);

router.route("/withMyInterests/:maxDistance")
    .get(UserController.listNearUsersWithMyInterests);

router.route('/:userId')
    .get(UserController.read)
    .put(UserController.update)
    .delete(UserController.delete);

router.route('/:userId/games/:gameId')
    .post(UserController.addGameToUserInterests)
    .delete(UserController.deleteGameFromUserInterests);

export const UsersRouter: Router = router;