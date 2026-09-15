import express from 'express'
import { getMe, getUserProfile, loginUser, registerUser } from '../controllers/user.controllers.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'

const userRoutes = express.Router()


userRoutes.post('/register', registerUser)
userRoutes.post('/login', loginUser)
userRoutes.get('/me' , isAuthenticated ,getMe )
userRoutes.get('/profile/:username' ,isAuthenticated ,getUserProfile )

// Implement log out route




export default userRoutes