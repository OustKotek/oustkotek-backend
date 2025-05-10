"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const app = (0, express_1.default)();
// Configure CORS with all necessary options
const corsOptions = {
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
    exposedHeaders: ["set-cookie"]
};
// Apply CORS middleware
app.use((0, cors_1.default)(corsOptions));
// Handle OPTIONS preflight requests
app.options('*', (0, cors_1.default)(corsOptions));
// Increase the limit for JSON payloads (50MB)
app.use(express_1.default.json({ limit: "50mb" }));
// Also increase the limit for URL-encoded payloads
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/posts", post_routes_1.default);
exports.default = app;
