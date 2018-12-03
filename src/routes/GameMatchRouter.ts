import { Router, Request, Response } from 'express';
import GameMatchController from 'controllers/GameMatchController';

const router: Router = Router();

router.route('/')
    .get(GameMatchController.listAll)
    .post(GameMatchController.create);

router.route('/:gameMatchId')
    .get(GameMatchController.read)
    .put(GameMatchController.update)
    .delete(GameMatchController.delete);

export const GameMatchsRouter: Router = router;