const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

// Register a new user;
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the fields");
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Create a new user
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    // Check if user was created successfully
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Failed to create the user");
    }
});

// Authenticate a user and get token;
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Please Enter all the fields");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// Search users
const allUsers = asyncHandler(async (req, res) => {

    // if (!req.user || !req.user._id) {
    //     res.status(401);
    //     throw new Error("Not authorized, user not found");
    // }

    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    } : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});

// Search one user
const oneUser = asyncHandler(async (req, res) => {
    const params = req.params.email;

    const user = await User.findOne({ email: params });
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("User Not Found !");
    }
})

module.exports = { registerUser, authUser, allUsers, oneUser };
