import { Router } from 'express';
import { requiresAuth } from 'middleware/Auth';
import { UsersRouter } from './UsersRouter';
import { GamesRouter } from './GamesRouter';
import bodyParser = require('body-parser');
import bearerToken = require('express-bearer-token');
import { GameMatchsRouter } from './GameMatchRouter';
import { JoinRequestRouter } from './JoinRequestRouter';

const router: Router = Router();

// Middlewares for this router
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bearerToken())

// TODO: Needs completion
router.use('/users', requiresAuth, UsersRouter);
router.use('/games', requiresAuth, GamesRouter);
router.use('/gameMatches', requiresAuth, GameMatchsRouter);
router.use('/joinRequests', requiresAuth, JoinRequestRouter);

export const BaseRouter: Router = router;