const { default: mongoose, mongo} = require('mongoose')

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        if (conn.connection.readyState) {
            console.log('DB connection is successfully!')
        } else {
            console.log('Failed')
        }

    } catch (error) {
        console.log('DB connection is failed')
        throw new Error(error)
    }
}

module.exports = dbConnect