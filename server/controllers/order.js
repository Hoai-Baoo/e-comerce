const Order = require('..\\models\\order')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async(req, res) => {
    const {title, description, category} = req.body
    if (!title || !description || !category) throw new Error('Missing inputs')
    const response = await Blog.create(req.body)
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot create new blog'
    })
})


module.exports = {
    createOrder,
}