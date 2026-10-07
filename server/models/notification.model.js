import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        // User who performed the action
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // User who should receive the notification
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // What kind of notification is this?
        type: {
            type: String,
            enum: ["follow", "like", "comment"],
            required: true
        },

        // Used when notification belongs to a post
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },

        // Used when notification belongs to a reel
        reel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reel"
        },

        // Used when notification belongs to a specific comment
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },

        // false = unread notification
        // true = user has already seen/read it
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

export default Notification;