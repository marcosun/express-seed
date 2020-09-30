import express, { Router } from 'express';

const router = Router();

/**
 * Find file by id.
 */
router.use('/files', express.static('public'))

export default router;
