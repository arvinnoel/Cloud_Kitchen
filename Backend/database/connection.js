const mongoose = require('mongoose')

function RunServer(){
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log('Mongoose connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = RunServer 