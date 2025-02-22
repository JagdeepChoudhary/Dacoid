import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult, body } from "express-validator";

export const register = [
    // Validation rules
    body('name', 'Name must contain at least 3 characters').optional().isLength({ min: 3 }),
    body('email', 'Please use a valid email').isEmail().custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
            throw new Error('A user already exists with this email address');
        }
    }),

    body('password', 'Password must contain at least 5 characters').isLength({ min: 5 }),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                success: false,
            });
        }

        try {
            const { name, email, password, } = req.body;
            // console.log(req.body)
            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

            const user = new User({
                name,
                email,
                password: hashedPassword,
            });
            await user.save();

            const data = {
                user: {
                    id: user.id,
                },
            };

            const token = jwt.sign(data, process.env.JWT_SECRET
                // , { expiresIn: '1h' }
            );

            return res.status(201)
                .cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
                .json({
                    message: "Account created successfully.",
                    success: true,
                });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Server error",
                success: false,
            });
        }
    }
];


export const login = [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password cannot be null').exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid Password" });
            }
            const data = {
                user: {
                    id: user.id,

                }

            };

            const token = jwt.sign(data, process.env.JWT_SECRET)
            // , { expiresIn: '1h' }
            user = {
                _id: user._id,
                email: user.email,
            };

            res.status(200)
                .cookie('token', token)
                .json({
                    message: `Welcome back ${user.name}.`,
                    success: true,
                    user,
                });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
];

export const logout = async (req, res) => {
    try {
        return res.status(200)
            .clearCookie("token", "")
            .json({
                success: true,
                message: "Logged out successfully",
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
};



