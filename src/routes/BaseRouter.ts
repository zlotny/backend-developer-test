import { Router } from 'express';
import { UsersRouter } from './UsersRouter';
import { GamesRouter } from './GamesRouter';
import bodyParser = require('body-parser');
import bearerToken = require('express-bearer-token');
import { GameMatchsRouter } from './GameMatchRouter';
import { JoinRequestRouter } from './JoinRequestRouter';
import AuthMiddleware from 'middleware/Auth';

const router: Router = Router();

// Middlewares for this router
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bearerToken())

// API routes
router.use('/users', AuthMiddleware.requiresAuth, UsersRouter);
router.use('/games', AuthMiddleware.requiresAuth, GamesRouter);
router.use('/gameMatches', AuthMiddleware.requiresAuth, GameMatchsRouter);
router.use('/joinRequests', AuthMiddleware.requiresAuth, JoinRequestRouter);

export const BaseRouter: Router = router;