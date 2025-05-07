import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:8081",
      "http://localhost:3000",
      "https://www.oustkotek.com",
      "https://oustkotek-frontend.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "credentials"],
  })
);
// Increase the limit for JSON payloads (50MB)
app.use(express.json({ limit: "50mb" }));
// Also increase the limit for URL-encoded payloads
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);

export default app;
