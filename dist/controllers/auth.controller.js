"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists." });
        const user = new user_model_1.User({
            username,
            email,
            password,
            role: role || 'user',
        });
        await user.save();
        res.status(201).json({ message: "User created", user });
    }
    catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await user_model_1.User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    }).json({ user });
};
exports.login = login;
const logout = (req, res) => {
    return res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    }).json({ message: 'Logged out' });
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        // Access user from req.user which is set in the isAuthenticated middleware
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        // Use _id property to find the user
        const user = await user_model_1.User.findById(req.user._id).select('-password');
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.json(user);
    }
    catch (error) {
        console.error('Error in getMe:', error);
        return res.status(500).json({ message: "Error fetching user", error });
    }
};
exports.getMe = getMe;
