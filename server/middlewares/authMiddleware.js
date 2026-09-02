import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const isAuthenticated = async (req, res , next) => {
    try {
        const token = req.cookies.token

        console.log(token)


        const decoded = jwt.verify(token, process.env.jwt_secret)

        const user = await User.findById(decoded.userId)

        req.user = user

        next()


    } catch (error) {
        console.log(error)
    }
}
