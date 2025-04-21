const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
dotenv.config()

connectDB();

app.get("/", (req, res) => {
    res.send("API is Talking 1!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes)

// Error Handling middlewares

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Katha is talking in PORT : ${PORT}`.yellow.bold)
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: [
            "http://localhost:5174",
            "http://localhost:5173",
            "http://localhost:4173",
            "http://localhost:3000",
            "https://code-red-ayzl.onrender.com",
            "https://code-red-dev.onrender.com",
            "https://dev-message.onrender.com"
        ]
    },
});

io.on("connection", (socket) => {
    // console.log("Connected to socket.iooo");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        // console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
