import express from "express";
import multer from "multer";
import { getFiles, loginController, registerController, uploadFilesController } from "./controllers.js";
import { checkAuthentication } from "./middleware.js";

const router = express.Router();


const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', registerController);
router.post('/login', loginController);

router.post('/upload', checkAuthentication, upload.single('file'), uploadFilesController);
router.get('/getFiles', checkAuthentication, getFiles);

export default router;