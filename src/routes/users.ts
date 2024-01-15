import {Router} from 'express';
import { login,registeruser } from '../controller/user';
import { verifyToken } from '../utility/middleware';
const router = Router();

/* GET users listing. */
router.post('/register', registeruser);
router.post('/login',login)
router.post('/verify',verifyToken)

export default router;
