import { Router, Request, Response } from 'express';
import UserController from 'controllers/UserController';

const router: Router = Router();

router.route('/')
    .get(UserController.listAll)
    .post(UserController.create);

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