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
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // List of allowed origins
      const allowedOrigins = [
        Env.FRONTEND_URL,
        "https://project-management-clowder.vercel.app",
        "https://project-management-kuoxxo3hg-clowderline-3066s-projects.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4173",
      ];

      // Check if the origin is in the allowed list or matches Vercel preview URLs
      const isAllowed =
        allowedOrigins.includes(origin) ||
        (origin.includes("project-management") &&
          origin.includes("vercel.app"));

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
