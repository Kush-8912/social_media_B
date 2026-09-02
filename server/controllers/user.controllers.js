// register controller
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import genToken from "../utils/generateToken.js"


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

        const salt = await bcrypt.genSalt(10)

        console.log(salt)

        const hashedPassword = await bcrypt.hash(password, salt)
        // We have to talk about rounds


        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword

        })

        const token = genToken(newUser._id)

        console.log(token)



        res.status(201).json({ message: 'User Registered', user: newUser })

    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }






}



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        // abc1234

        if (!email || !password) {
            return res.status(400).json({ message: 'All fileds Required' })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' })
        }

        const passwordMatched = await bcrypt.compare(password, user.password)


        if (!passwordMatched) {
            return res.status(401).json({ message: 'Password Did not match' })
        }

        console.log(passwordMatched)

        res.status(200).json({ message: 'User Logged In' })

    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }
}

