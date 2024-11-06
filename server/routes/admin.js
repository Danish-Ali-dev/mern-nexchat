import express from "express";
import {
  allChats,
  allMessages,
  allUsers,
  getDashboardStats,
} from "../controllers/admin.js";

const app = express();

export default app;

app.get("/users", allUsers);
app.get("/chats", allChats);
app.get("/messages", allMessages);
app.get("/stats", getDashboardStats);
