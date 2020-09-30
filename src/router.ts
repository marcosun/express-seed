import { Router } from 'express';
import fileRouter from './fileRouter';

const router = Router();

router.use(fileRouter);

export default router;
