const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config();

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).send("Server error!");
    }
};

const signup = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ error: "Username, email and password are required!" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already taken!" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already registered!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: [],
        });

        const result = await user.save();

        const token = jwt.sign(
            { id: result._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }
        );

        res.status(201).json({ token, userId: result._id });
    } catch (err) {
        console.error("Error signing up:", err.message);
        res.status(500).send("Server error!");
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required!" });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }
        );

        res.json({ token, userId: existingUser._id });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Server error!");
    }
};

const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        res.json(user);
    } catch (err) {
        console.error("Error fetching user:", err.message);
        res.status(500).send("Server error!");
    }
};

const updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    const { email, password } = req.body;

    try {
        const updateFields = {};

        if (email) updateFields.email = email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const result = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select('-password');

        if (!result) {
            return res.status(404).json({ error: "User not found!" });
        }

        res.json(result);
    } catch (err) {
        console.error("Error updating user profile:", err.message);
        res.status(500).send("Server error!");
    }
};

const deleteUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ error: "User not found!" });
        }

        res.json({ message: "User profile deleted!" });
    } catch (err) {
        console.error("Error deleting user profile:", err.message);
        res.status(500).send("Server error!");
    }
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};
