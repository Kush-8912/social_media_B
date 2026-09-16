import express from 'express'
import { followUser, getMe, getUserProfile, loginUser, registerUser, unFollowUser } from '../controllers/user.controllers.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'

const userRoutes = express.Router()

userRoutes.post('/register', registerUser)
userRoutes.post('/login', loginUser)
userRoutes.get('/me', isAuthenticated, getMe)
userRoutes.get('/profile/:username', isAuthenticated, getUserProfile)

userRoutes.post('/:id/follow', isAuthenticated, followUser)
userRoutes.post('/:id/unfollow', isAuthenticated, unFollowUser)

export default userRoutes
