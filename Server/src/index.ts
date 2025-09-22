import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { projectRouter } from "./routes/projectRoutes.js";
import cors from "cors";
import { userRouter } from "./routes/userRouter.js";
import { screenRouter } from "./routes/screenRouter.js";
import cookieParser from "cookie-parser"; // Make sure this is imported

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_DB_URL = process.env.MONGO_DB_URL!;

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin); // Reflect the request origin
    },
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/screens", screenRouter);
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
