require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const taskRoutes = require("./routes/tasks")


app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8087
const connection = require('./db')
connection()

app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)