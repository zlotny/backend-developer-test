import { Router, Request, Response } from 'express';
import GameController from 'controllers/GameController';
import { denyToRegularUsers } from 'middleware/Auth';

const router: Router = Router();

router.route('/')
    .get(GameController.listAll)
    .post(denyToRegularUsers, GameController.create);

router.route('/:gameId')
    .get(GameController.read)
    .put(denyToRegularUsers, GameController.update)
    .delete(denyToRegularUsers, GameController.delete);

export const GamesRouter: Router = router;