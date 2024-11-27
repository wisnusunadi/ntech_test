import express from "express";
import { getUsers, Login, registerUsers, updateImage, updateUsers } from "../controllers/User.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { getBanner, getService } from "../controllers/ModuleInfo.js";
import { getBalance, history, topUp, transaction } from "../controllers/Transactions.js";
import upload from "../controllers/UploadImages.js";

const router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to test API by wisnu')
  })
// Member 
router.put('/profile/update',verifyToken,updateUsers);
router.put('/profile/image',upload.single('file'),verifyToken,updateImage);
router.get('/profile',verifyToken,getUsers);
router.post('/registration',registerUsers);
router.post('/login',Login);


// ModuleInfo
router.get('/banner',getBanner)
router.get('/services',verifyToken,getService)


//Transaksi
router.get('/balance',verifyToken,getBalance);
router.post('/topup',verifyToken,topUp);
router.post('/transaction',verifyToken,transaction);
router.get('/transaction/history',verifyToken,history);



export default router;