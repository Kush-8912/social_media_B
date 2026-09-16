// register controller
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import genToken from "../utils/generateToken.js"

const cookieOptions = {
    httpOnly: true
}

const populateUserConnections = (query) => query
    .populate('followers', 'name username profileImage isVerified')
    .populate('following', 'name username profileImage isVerified')

export const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        if (password.length <= 6) {
            return res.status(400).json({ message: 'Password should be greater than 6 characters' })
        }

        const userExists = await User.findOne({ username })
        if (userExists) return res.status(409).json({ message: 'User Already Exists' })

        const emailExists = await User.findOne({ email })
        if (emailExists) return res.status(409).json({ message: 'User Already Exists' })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({ name, username, email, password: hashedPassword })
        const token = genToken(newUser._id)
        res.cookie('token', token, cookieOptions)

        const safeUser = newUser.toObject()
        delete safeUser.password

        res.status(201).json({ message: 'User Registered', user: safeUser })
    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ message: 'All fields are required' })

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: 'User Not Found' })

        const passwordMatched = await bcrypt.compare(password, user.password)
        if (!passwordMatched) return res.status(401).json({ message: 'Password Did not match' })

        const token = genToken(user._id)
        res.cookie('token', token, cookieOptions)

        const safeUser = user.toObject()
        delete safeUser.password
        res.status(200).json({ message: 'User Logged In', userData: safeUser })
    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}

export const getMe = async (req, res) => {
    if (!req.user) return res.status(404).json({ message: 'User Not Found' })

    const authenticatedUser = await populateUserConnections(
        User.findById(req.user._id).select('-password')
    )

    res.status(200).json({ authenticatedUser })
}

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params
        const user = await populateUserConnections(
            User.findOne({ username }).select('-password')
        )

        if (!user) return res.status(404).json({ message: 'User Not Found' })

        const currentUserId = req.user?._id?.toString()
        const isFollowing = currentUserId
            ? user.followers.some((follower) => follower._id.toString() === currentUserId)
            : false

        res.status(200).json({
            message: 'User found',
            userData: user,
            isFollowing,
            followersCount: user.followers.length,
            followingCount: user.following.length
        })
    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}

export const followUser = async (req, res) => {
    try {
        const currentUserId = req.user._id
        const targetUserId = req.params.id

        if (!targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user id' })
        }

        if (currentUserId.toString() === targetUserId.toString()) {
            return res.status(409).json({ message: 'You cannot follow yourself' })
        }

        const targetUser = await User.findById(targetUserId)
        if (!targetUser) return res.status(404).json({ message: 'Target user not found' })

        await Promise.all([
            User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } }),
            User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } })
        ])

        const updatedTargetUser = await populateUserConnections(
            User.findById(targetUserId).select('-password')
        )

        res.status(200).json({
            message: 'User followed',
            userData: updatedTargetUser,
            isFollowing: true,
            followersCount: updatedTargetUser.followers.length,
            followingCount: updatedTargetUser.following.length
        })
    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}

export const unFollowUser = async (req, res) => {
    try {
        const currentUserId = req.user._id
        const targetUserId = req.params.id

        if (!targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user id' })
        }

        if (currentUserId.toString() === targetUserId.toString()) {
            return res.status(409).json({ message: 'You cannot unfollow yourself' })
        }

        const targetUser = await User.findById(targetUserId)
        if (!targetUser) return res.status(404).json({ message: 'Target user not found' })

        await Promise.all([
            User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } }),
            User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } })
        ])

        const updatedTargetUser = await populateUserConnections(
            User.findById(targetUserId).select('-password')
        )

        res.status(200).json({
            message: 'User unfollowed',
            userData: updatedTargetUser,
            isFollowing: false,
            followersCount: updatedTargetUser.followers.length,
            followingCount: updatedTargetUser.following.length
        })
    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}
