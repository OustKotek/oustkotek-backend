"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
router.get('/user', auth_middleware_1.isAuthenticated, auth_controller_1.getMe);
exports.default = router;
