import User from "./models/userModel.js";
import FileMetaData from "./models/fileModel.js"
import { BlobServiceClient } from "@azure/storage-blob";
import { hashPassword, comparePassword } from "./authHelper.js";
import JWT from "jsonwebtoken";


export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, } = req.body;
        //validations
        console.log(req.body);
        if (!name) {
            return res.send({ error: "Name is Required" });
        }
        if (!email) {
            return res.send({ message: "Email is Required" });
        }
        if (!password) {
            return res.send({ message: "Password is Required" });
        }
        if (!phone) {
            return res.send({ message: "Phone no is Required" });
        }

        //check user
        const exisitingUser = await User.findOne({ email });
        //exisiting user
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please login",
            });
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new User({
            name,
            email,
            phone,
            password: hashedPassword,
            files: []
        }).save();
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registeration",
            error,
        });
    }
};


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        //check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            token,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};


export const uploadFilesController = async (req, res) => {
    try {
        console.log("request reached");
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }


        const { caption } = req.body;
        const file = req.file;
        console.log(file);
        const blobName = Date.now() + '-' + file.originalname;

        // Upload file to Azure Blob Storage
        // console.log(process.env.ACCOUNT_NAME);
        // console.log(process.env.CONTAINER_NAME);
        // console.log(process.env.SAS_TOKEN);
        const blobServiceClient = new BlobServiceClient(`https://${process.env.ACCOUNT_NAME}.blob.core.windows.net/?${process.env.SAS_TOKEN}`);
        const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadData(file.buffer);

        const fileUrl = blockBlobClient.url;

        // Save file metadata in MongoDB
        const newFile = new FileMetaData({
            ownerID: req.user._id,
            fileName: file.originalname,
            fileType: file.mimetype,
            caption: caption,
            fileURL: fileUrl
        });

        await newFile.save();

        res.status(200).json({
            message: 'File uploaded successfully',
            fileUrl: fileUrl
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export const getFiles = async (req, res) => {
    try {
        console.log("authorization passed");
        const files = await FileMetaData.find({
            ownerID: req.user._id
        });
        res.json(files);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            success: false,
            message: "Error while getting user Files",
            e,
        });
    }
};