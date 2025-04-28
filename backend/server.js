import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import { userRoutes, plantRoutes } from "./routes/routes.js";

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb+srv://soumiksingha8:TZzjcFud0RE7Rf2a@thermography.dobr5s2.mongodb.net/");
const db = mongoose.connection;


db.on("open", () => {
    console.log("Database Connected!");
})

db.on("error", () => {
    console.log("Connection is not sucessful!");
})

app.listen(8100, () => {
    console.log("server is running on port 8100!");
})

userRoutes(app);
plantRoutes(app);
