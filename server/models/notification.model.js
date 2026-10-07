import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {
        type: String,
        enum: ['follow', 'like', 'comment'],
        required: true
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"

    },

    reel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reel"

    },

    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },

    isRead: {
        type: Boolean,
        default: false
    }

}
 , { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
