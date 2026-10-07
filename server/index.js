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
import notificationRoutes from "./routes/notification.routes.js";

import errorMiddleware from "./middlewares/error.middleware.js";


// ----------------------------------------------------
// PATH SETUP
// ----------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ----------------------------------------------------
// ENV SETUP
// ----------------------------------------------------

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


const missingEnvVars = requiredEnvVars.filter(
    (key) => !process.env[key]
);


if (missingEnvVars.length > 0) {

    console.error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );

    process.exit(1);
}


// ----------------------------------------------------
// EXPRESS + HTTP SERVER
// ----------------------------------------------------

const app = express();


// Socket.IO does not directly attach to Express.
//
// Express:
// app
//
// Actual HTTP server:
// httpServer
//
// Socket.IO:
// io
//
// Both Express HTTP requests and Socket.IO connections
// will use the same server/port.

const httpServer = createServer(app);


// ----------------------------------------------------
// SOCKET.IO SETUP
// ----------------------------------------------------

const io = new Server(httpServer, {

    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }

});


// ----------------------------------------------------
// ONLINE USERS
// ----------------------------------------------------

// We need to know:
//
// Which application user owns which socket?
//
// Structure:
//
// userId -> socketId
//
// Example:
//
// {
//    "user123" => "socketABC",
//    "user456" => "socketXYZ"
// }

const onlineUsers = new Map();


// ----------------------------------------------------
// SOCKET CONNECTION
// ----------------------------------------------------

io.on("connection", (socket) => {

    console.log(
        "Socket connected:",
        socket.id
    );


    // ------------------------------------------------
    // REGISTER USER
    // ------------------------------------------------

    // When the frontend socket connects,
    // it will send the logged-in user's id:
    //
    // socket.emit("register-user", user._id)
    //
    // We then connect that userId with this socketId.

    socket.on("register-user", (userId) => {

        if (!userId) {
            return;
        }


        const userIdString = userId.toString();


        // Store:
        //
        // userId -> socketId

        onlineUsers.set(
            userIdString,
            socket.id
        );


        // Store the userId on the socket itself.
        //
        // This makes disconnect cleanup very easy later.

        socket.userId = userIdString;


        console.log(
            "User registered:",
            userIdString
        );


        console.log(
            "Socket ID:",
            socket.id
        );


        console.log(
            "Online Users:",
            Array.from(onlineUsers.entries())
        );

    });


    // ------------------------------------------------
    // DISCONNECT
    // ------------------------------------------------

    socket.on("disconnect", () => {

        console.log(
            "Socket disconnected:",
            socket.id
        );


        // If this socket belonged to a registered user,
        // remove the user from our online users map.

        if (socket.userId) {

            onlineUsers.delete(
                socket.userId
            );


            console.log(
                "User removed from online users:",
                socket.userId
            );


            console.log(
                "Online Users:",
                Array.from(onlineUsers.entries())
            );

        }

    });

});


// ----------------------------------------------------
// SERVER PORT
// ----------------------------------------------------

const port = 8084;


// ----------------------------------------------------
// DATABASE CONNECTION
// ----------------------------------------------------

mongoose
    .connect(process.env.dbURL)

    .then(() => {

        console.log("DB Connected");

    })

    .catch((err) => {

        console.log(err);

    });


// ----------------------------------------------------
// EXPRESS MIDDLEWARES
// ----------------------------------------------------

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);


app.use(express.json());

app.use(cookieParser());


// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------

app.use(
    "/users",
    userRoutes
);


app.use(
    "/posts",
    postRoutes
);


app.use(
    "/reels",
    reelRoutes
);


app.use(
    "/comments",
    commentRoutes
);


app.use(
    "/stories",
    storyRoutes
);


// Keeping the same route prefix currently present
// in your project.
//
// GET /notification

app.use(
    "/notification",
    notificationRoutes
);


// ----------------------------------------------------
// GLOBAL ERROR HANDLER
// ----------------------------------------------------

app.use(errorMiddleware);


// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------

// IMPORTANT:
//
// We use:
//
// httpServer.listen()
//
// NOT:
//
// app.listen()
//
// because Socket.IO is attached to httpServer.

httpServer.listen(port, () => {

    console.log(
        `Server Started at ${port}`
    );

});