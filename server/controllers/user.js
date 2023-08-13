const User = require('..\\models\\user')
const asyncHandler = require('express-async-handler')
const {generateAccessToken, generateRefreshToken} = require('..\\middlewares\\jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('..\\utils\\sendMail')
const crypto = require('crypto')

const register = asyncHandler( async(req, res) => {
    const {email, password, firstname, lastname} = req.body
    if (!email || !password || !firstname || !lastname)
    return res.status(400).json({
        success: false,
        mes: 'Missing inputs'
    })

    const user = await User.findOne({email})
    if (user) 
        throw new Error('User has existed!')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Register is successfully. Please go login!' : 'Something went wrong'
        })
    }
})


//Refresh Token => Generate new token
//Access Token => Validate users, admintrator 
const login = asyncHandler( async(req, res) => {
    const {email, password} = req.body
    if (!email || !password)
    return res.status(400).json({
        success: false,
        mes: 'Missing inputs'
    })

    const response = await User.findOne({email}) //findOne return a object only read by mongoose
    if (response && await response.isCorrectPassword(password)) {
        // Extract pass and role from response
        const {password, role, refreshToken,...userData} = response.toObject() //convert to plain object
        const accessToken = generateAccessToken(response._id, role)
        const newRefreshToken = generateRefreshToken(response._id)
        
        // Save refreshToken to DB
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken}, { new:true})
        // Save refresh token to cookie
        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, maxAge: 7*24*60*60*1000})
        
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } 
    else {
        throw new Error('Invalid credentials')
    }
})

const getCurrent = asyncHandler( async(req, res) => {
    const {_id} = req.user
    const user = await User.findById(_id).select('-password -refreshToken -role')
    return res.status(200).json({
        success: user ? true : false,
        result: user? user: 'User is not found'
    })
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    // Extract token from cookies
    const cookie = req.cookies
    // Check having refresh token in cookies?
    if (!cookie && !cookie.refreshToken) 
        throw new Error('No refresh token in cookies!')
    // Check token is valid or no?
    const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({_id: result._id, refreshToken: cookie.refreshToken})
        return res.status(200).json({
            success: response ? true: false,
            newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh Token is not matched'
    })
})

const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Delete refresh token in DB
    await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new: true})
    // Delete refresh token in cookie browser
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done!' 
    })
})

//-----------------Reset Password through email-------------------------
// Client send email
// Server check email is valided or no => Valid: Send mail and link (password change token)
// Client check mail => click link
// Client send API attaching a token
// Check token is similar with server send
// Change password
const forgotPassword = asyncHandler(async(req,res) => {
    const {email} = req.query
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({email})
    if (!user) throw new Error('Email is not existed!')
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = `Please follow this link to get a new password. This link will expire after 15 min from now. \ 
    <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}> Click here</a>`

    const data = {
        email,
        html
    }

    const result = await sendMail(data)
    return res.status(200).json({
        success: true,
        result
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing input')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({passwordResetToken, passwordResetExpires: {$gt: Date.now()}})
    if (!user) throw new Error('Invalid reset token!')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    user.passwordChangedAt = Date.now()
    await user.save()
    return res.status(200).json({
        success: user ? true: false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})

const getUsers = asyncHandler(async(req, res) => {
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})

const deleteUser = asyncHandler(async(req, res) => {
    const { _id} = req.query
    if (!_id) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deletedUser: response ? `User with email ${response.email} is deleted` : 'No user delete'
    })
})


const updateUserPersonal = asyncHandler(async(req, res) => {
    const { _id} = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, {new : true}).select('-password -role')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong!'
    })
})

const updateUserAdmin = asyncHandler(async(req, res) => {
    const { userId} = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(userId, req.body, {new : true}).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong!'
    })
})


const updateUserAddress = asyncHandler(async(req, res) => {
    const { _id} = req.user
    if (!req.body.address) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, {$push: {address: req.body.address}}, {new : true})
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong!'
    })
})


const updateUserCart = asyncHandler(async(req, res) => {
    const { _id} = req.user
    const {productId, quantity, color} = req.body
    
    if (!productId || !quantity || !color) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const havingInCart = user?.cart?.find(element => element.product.toString() === productId)
    console.log(havingInCart)
    if (havingInCart) {
        if (havingInCart.color === color) {
            console.log('samecolor')
            const response = await User.updateOne({cart: {$elemMatch: havingInCart}}, {$set: {'cart.$.quantity': quantity}}, {new: true})
            return res.status(200).json({
                success: response ? true : false,
                updatedUser: response ? response : 'Something went wrong!'
            })
        } else {
            const response = await User.findByIdAndUpdate(_id, {$push: {cart: {product: productId, quantity, color}}}, {new: true})
            return res.status(200).json({
                success: response ? true : false,
                updatedUser: response ? response : 'Something went wrong!'
            })
        }
    } else {
        const response = await User.findByIdAndUpdate(_id, {$push: {cart: {product: productId, quantity, color}}}, {new: true})
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : 'Something went wrong!'
        })
    } 
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUserPersonal,
    updateUserAdmin,
    updateUserAddress,
    updateUserCart,
}
