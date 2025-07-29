import morgan from "morgan";
import "dotenv/config";
import cors from "cors";
import express from "express";
import { Env } from "./config/env.config";
import routes from "./routes/index.route";
import { errorHandler } from "./middleware/errorHandler.middleware";
import connectDatabase from "./config/database.config";

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

app.use(morgan("dev"));

app.use("/api/v1", routes);

app.use(errorHandler);

app.listen(Env.PORT, () => {
  console.log(`Server is running on port ${Env.PORT}`);
});
