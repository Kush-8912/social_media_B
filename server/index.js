import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'

const app = express()
const Port = 8085

dotenv.config()

mongoose.connect(process.env.dbUrl).then(() => {
    console.log("Db Connected")
}).catch((err) => {
    console.log(err)
})

app.use(express.json())


app.use('/users' , userRoutes)



app.get('/', (req, res) => {
    res.send('Sever On Hellllooooo...')
})


app.listen(Port, () => {
    console.log(`Server Startet at ${Port}`)
})

