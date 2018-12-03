import { Router, Request, Response } from 'express';
import UserController from 'controllers/UserController';

const router: Router = Router();

router.route('/')
    .get(UserController.listAll)
    .post(UserController.create);

router.route('/:userId')
    .get(UserController.read)
    .put(UserController.update)
    .delete(UserController.delete);

export const UsersRouter: Router = router;