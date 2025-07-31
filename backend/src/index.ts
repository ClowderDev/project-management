import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { Env } from "./config/env.config";
import routes from "./routes/index.route";
import { errorHandler } from "./middleware/errorHandler.middleware";
import connectDatabase from "./config/database.config";

// Import all models to register schemas with Mongoose
import "./models/user.model";
import "./models/workspace.model";
import "./models/project.model";
import "./models/task.model";
import "./models/comment.model";
import "./models/activity.model";
import "./models/verification.model";
import "./models/workspace-invite.model";

const app = express();

connectDatabase();

app.use(
  cors({
    origin: Env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.use(errorHandler);

app.listen(Env.PORT, () => {
  console.log(`Server is running on port ${Env.PORT}`);
});
