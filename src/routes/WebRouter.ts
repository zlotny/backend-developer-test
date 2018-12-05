import { Router } from 'express';
import WebController from 'controllers/WebController';

const router: Router = Router();

router.use('/', WebController.landing);

export const WebRouter: Router = router;