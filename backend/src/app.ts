import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "../src/app/routes/index";
import Config from "./app/config";
import globalErrorHandler from "./app/middlewares/error";
import { notFound } from "./app/middlewares/not-found";
import cookieParser from "cookie-parser";
const app = express();

// Middlewares

app.use(cookieParser()); 
app.use(
  cors({
    origin: [Config.FRONTEND_BASE_URL!],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", router);
app.get("/", async (req, res) => {
  res.send("Hello from server");
});
// 404 Handler
app.use(notFound);

app.use(globalErrorHandler);

export default app;
