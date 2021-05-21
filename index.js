// Initialize All Library
const express = require('express')
const app = express()
const cors = require('cors')

// Initialize Cors
app.use(cors())

// Initialize Body Parser
app.use(express.json())

// Import Router
const consumerRouter = require('./Routers/ConsumerRouter')
// const adminRouter = require('./Routers/AdminRouter')

// Initialize PORT
const PORT = 8000

// Route
app.get('/', (req, res) => {
    res.status(200).send(`
        <h1> API is Running</h1>
    `)
})

app.use('/Consumer', consumerRouter)
// app.use('/Admin',adminRouter)

app.listen(PORT, () => console.log('API running on ' + PORT))