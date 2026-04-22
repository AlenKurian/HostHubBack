const mongoose = require('mongoose')

mongoose.connect(process.env.DBCONNECTIONSTRING).then((res) => {
    console.log('MongoDB Connected...')
})
.catch(err => {
        console.log('MongoDB Connection Err!' +err)
})