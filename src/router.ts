import { Router } from 'express';
import staticRouter from './staticRouter';

const router = Router();

router.use(staticRouter);

export default router;
