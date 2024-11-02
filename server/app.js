import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";

dotenv.config({
    path: "./.env"
});
const mongoUri = process.env.MONGO_URI
const port = process.env.PORT || 3000;
connectDB(mongoUri);

// createUser(10);  use to create fake users

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

app.get("/", (req,res)=>{
    res.send("Home Route");
})

app.use(errorMiddleware);

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})