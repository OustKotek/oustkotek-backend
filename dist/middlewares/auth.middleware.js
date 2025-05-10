"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_model_1.User.findById(decoded.id);
        if (!user)
            throw new Error();
        // Ensure user is attached to request properly
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req, res, next) => {
    if ((req.user)?.role !== 'admin') {
        res.status(403).json({ message: 'Admin only can access' });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
// git push
