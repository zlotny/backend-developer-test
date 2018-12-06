import { Router } from 'express';
import WebController from 'controllers/WebController';

const router: Router = Router();

// Shows a landing page with links to auth and api-docs
router.use('/', WebController.landing);

export const WebRouter: Router = router;