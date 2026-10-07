import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import reelRoutes from "./routes/reel.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import storyRoutes from "./routes/story.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import notificationRoutes from "./routes/notification.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, ".env")
});

const requiredEnvVars = [
    "dbURL",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
    process.exit(1);
}

const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // recieve and reply back to the client
    socket.on("follow", (data) => {
        console.log("Message from client:", data);
        socket.emit("server-reply", {
            message: "Hello Client, I received your message"
        });

    });



    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});






const port = 8084;






mongoose.connect(process.env.dbURL)
    .then(() => {
        console.log("DB Connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/reels", reelRoutes);
app.use("/comments", commentRoutes);
app.use("/stories", storyRoutes);
app.use("/notification", notificationRoutes);

app.use(errorMiddleware);


httpServer.listen(port, () => {
    console.log(`Server Started at ${port}`);
});
