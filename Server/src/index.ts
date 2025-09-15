import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { projectRouter } from "./routes/projectRoutes.js";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_DB_URL = process.env.MONGO_DB_URL!;

app.use(cors());
app.use(express.json());

app.use("/api/v1/projects", projectRouter)
app.get("/", (req, res) => {
  res.send("Working ");
});

async function Main() {
  try {
    await mongoose.connect(MONGO_DB_URL);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect to mongoDB and server");
  }
}
Main();
