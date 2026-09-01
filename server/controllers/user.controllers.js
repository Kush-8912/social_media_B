// register controller
import User from "../models/user.model.js"


export const registerUser = async (req, res) => {
    try {

        const { name, username, email, password } = req.body


        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fileds Required' })
        }

        if (password.length <= 6) {
            return res.status(400).json({ message: 'Password should be greater than 6 characters' })
        }

        const userExists = await User.findOne({ username })

        if (userExists) {
            return res.status(409).json({ message: 'User Already Exists' })
        }


        const emailExists = await User.findOne({ email })

        if (emailExists) {
            return res.status(409).json({ message: 'User Already Exists' })
        }


        const newUser = await User.create({
            name,
            username,
            email,
            password

        })

        res.status(201).json({ message: 'User Registered', user: newUser })

    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }






}

