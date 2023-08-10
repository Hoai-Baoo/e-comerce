const jwt = require('jsonwebtoken')

const generateAccessToken = (userId, role) => jwt.sign({_id:userId, role}, process.env.JWT_SECRET, { expiresIn: '2d'}) // same {return ...}
const generateRefreshToken = (userId) => jwt.sign({_id:userId}, process.env.JWT_SECRET, { expiresIn: '7d'}) // same {return ...}


module.exports = {
    generateAccessToken,
    generateRefreshToken
}