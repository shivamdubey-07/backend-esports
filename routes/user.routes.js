import {Router} from "express"
import {registerUser,loginUser,updateProfile} from "../controller/user.controller.js"
import express from "express"
import { upload } from "../middlewares/multer.middleware.js";
import {isAuth} from "../middlewares/auth.middleware.js"

const router=express.Router();

router.post('/register-user',registerUser)
router.post('/login-user',loginUser)
router.patch("/update-profile",isAuth,upload.single("profileImage"),updateProfile)

export default router