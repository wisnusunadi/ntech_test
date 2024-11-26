import express from "express";
import { getUsers, Login, registerUsers } from "../controllers/User.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to test API by wisnu')
  })

router.get('/users',verifyToken,getUsers);
router.post('/users',registerUsers);
router.post('/login',Login);
router.get('/token', refreshToken)

export default router;