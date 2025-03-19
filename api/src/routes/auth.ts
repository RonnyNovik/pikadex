import express from 'express';
import { AuthController } from '../controllers/auth';

const router = express.Router();
const {
    login,
    register
} = new AuthController();

router.post('/login', login);
router.post('/register', register);

export default router;