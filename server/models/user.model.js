import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    profileImage: {
        type: String
    },

    followers: [],

    following: [],

    bio: {
        type: String
    },

    posts: [],
    stories: [],
    reels: [],

    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }


})


const User = mongoose.model('User', userSchema)

export default User