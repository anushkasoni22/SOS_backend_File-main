import express from 'express'
import { processAndUploadFile } from '../controllers/fileUploadController';
import { upload } from '../config/multer';
import { fetchUser, login, logout } from '../controllers/authController';
import { checkAuth } from '../middleware/authMiddlware';
const authRouter=express.Router();
authRouter.post(
    "/login",
    login
);
authRouter.post(
    "/logout",
    checkAuth,
    logout
);
authRouter.get(
    "/fetch-user",
    checkAuth,
    fetchUser
);

export default authRouter;