import { Router, Request, Response } from 'express';
import GameController from 'controllers/GameController';

const router: Router = Router();

router.route('/')
    .get(GameController.listAll)
    .post(GameController.create);

router.route('/:gameId')
    .get(GameController.read)
    .put(GameController.update)
    .delete(GameController.delete);

export const GamesRouter: Router = router;