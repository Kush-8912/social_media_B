import express from 'express'
import { followUser, getMe, getUserProfile, loginUser, registerUser, unfollowUser } from '../controllers/user.controllers.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'

const userRoutes = express.Router()

userRoutes.post('/register', registerUser)
userRoutes.post('/login', loginUser)
userRoutes.get('/me', isAuthenticated, getMe)
userRoutes.get('/profile/:username', isAuthenticated, getUserProfile)

// Following and followers
userRoutes.post('/:id/follow', isAuthenticated, followUser)
userRoutes.delete('/:id/unfollow', isAuthenticated, unfollowUser)

export default userRoutes
