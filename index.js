import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Routes from "./routes.js";
import cors from "cors";
dotenv.config();
connectDB();

const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Ping received! Server is working!' });
});
app.use("/api/v1/auth",Routes)
const PORT=process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});