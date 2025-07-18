import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router; 