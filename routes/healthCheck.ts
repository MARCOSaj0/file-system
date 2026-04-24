import { Router } from 'express';
import { healthCheck } from '../controller/healthCheck.js';

const router: Router = Router();

router.get('/', healthCheck);

export default router;