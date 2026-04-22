require('dotenv').config()

const express = require('express')
const cors = require('cors')
require('./config/db')
const router = require('./router/route')

const hosthubserver = express()

hosthubserver.use(cors())
hosthubserver.use(express.json())
hosthubserver.use(router)

const PORT = 3000 || process.env.PORT

hosthubserver.get('/', (req, res) => {
    res.json('HostHub server started...')
})

hosthubserver.listen(PORT, () => {
    console.log(`Hosthub server running on port ${PORT}`);
})