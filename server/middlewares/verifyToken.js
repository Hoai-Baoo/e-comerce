const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyAcessToken = asyncHandler(async(req,res,next) => {
    // Bearer 'token string'
    // Headers: { authorization: Bearer 'token string'}
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1] 
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) return res.status(401).json({
                success: false,
                mes: 'Invalid access token'
            })
            req.user = decode
            next()
        })
    } else {
        return res.status(401).json({
            success: false,
            mes: 'Require authentication!!'
        })
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const { role } = req.user
    if (role != 'admin') 
    return res.status(401).json({
        success: false,
        mes: 'REQUIRE ADMIN ROLE'
    })
    next()
})

module.exports = {
    verifyAcessToken,
    isAdmin
}