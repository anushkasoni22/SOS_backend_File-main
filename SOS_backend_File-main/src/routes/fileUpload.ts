import express from 'express'
import { processAndUploadFile } from '../controllers/fileUploadController';
import { upload } from '../config/multer';
const fileUploadRouter=express.Router();
fileUploadRouter.post(
    "/upload-file",
    upload.fields([{ name: "image" }, { name: "video" }]),
    processAndUploadFile
);
export default fileUploadRouter;