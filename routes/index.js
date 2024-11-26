import express from "express";
import { getUsers, Login, registerUsers, updateUsers } from "../controllers/User.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { getBanner, getService } from "../controllers/ModuleInfo.js";
import { history, topUp, transaction } from "../controllers/Transactions.js";

const router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to test API by wisnu')
  })
// Member 
router.put('/profile/update',verifyToken,updateUsers);
router.get('/profile',verifyToken,getUsers);
router.post('/registration',registerUsers);
router.post('/login',Login);
router.get('/token', refreshToken)

// ModuleInfo
router.get('/banner',getBanner)
router.get('/services',verifyToken,getService)


//Transaksi
router.post('/topup',verifyToken,topUp);
router.post('/transaction',verifyToken,transaction);
router.get('/transaction/history',verifyToken,history);


export default router;