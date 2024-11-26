import express from "express";
import { getUsers, Login, registerUsers } from "../controllers/User.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { getBanner, getService } from "../controllers/ModuleInfo.js";

const router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to test API by wisnu')
  })
// Member 
router.get('/profile',verifyToken,getUsers);
router.post('/users',registerUsers);
router.post('/login',Login);
router.get('/token', refreshToken)

// ModuleInfo
router.get('/banner',getBanner)
router.get('/services',verifyToken,getService)


export default router;