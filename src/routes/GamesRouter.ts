import { Router } from 'express';
import GameController from 'controllers/GameController';
import AuthMiddleware from 'middleware/Auth';

const router: Router = Router();

router.route('/')
    .get(GameController.listAll)
    .post(AuthMiddleware.denyToRegularUsers, GameController.create);

router.route('/:gameId')
    .get(GameController.read)
    .put(AuthMiddleware.denyToRegularUsers, GameController.update)
    .delete(AuthMiddleware.denyToRegularUsers, GameController.delete);

export const GamesRouter: Router = router;