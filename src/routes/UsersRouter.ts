import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('ImplementMe!');
});

export const UsersRouter: Router = router;