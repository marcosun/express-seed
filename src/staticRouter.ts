import express, { Router } from 'express';

const router = Router();

/**
 * Find content by id.
 */
router.use('/static', express.static('public'))

export default router;
