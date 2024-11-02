import express from "express";
import { getMyProfile, login, logout, newUser, searchUser } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express();

app.post("/login", login);
app.post("/new", singleAvatar, newUser);

app.use(isAuthenticated);
app.get("/me", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);

export default app;