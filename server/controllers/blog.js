const Blog = require('..\\models\\blog')
const asyncHandler = require('express-async-handler')
// const slugify = require('slugify')

const createBlog = asyncHandler(async(req, res) => {
    const {title, description, category} = req.body
    if (!title || !description || !category) throw new Error('Missing inputs')
    const response = await Blog.create(req.body)
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot create new blog'
    })
})

const getAllBlogs = asyncHandler(async(req, res) => {
    const response = await Blog.find()
    return res.json({
        success: response ? true : false,
        allBlogs: response ? response : 'Cannot get all blogs'
    })
})


const updateBlog = asyncHandler(async(req, res) => {
    const {blogId} = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await Blog.findByIdAndUpdate(blogId, req.body, {new : true})
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Cannot update the blog'
    })
})


const deleteBlog = asyncHandler(async(req, res) => {
    const {blogId} = req.params
    const response = await Blog.findByIdAndDelete(blogId)
    return res.json({
        success: response ? true : false,
        deletedBlog: response ? response : 'Cannot delete the blog '
    })
})
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGQ0ZmMwYmNlZjJlMWZhMjRlMzEyNTAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTE4MjA2OTUsImV4cCI6MTY5MTk5MzQ5NX0.L9uYC-Qin0gtI0wwAQk9D4ofe0AaUimYWn1kmT0S26Q
const likeBlog = asyncHandler(async(req, res) => {
    const { _id} = req.user
    const {blogId} = req.body
    if (!blogId) throw new Error('Missing inputs')
    const blog = await Blog.findById(blogId)

    const isDisliked = blog?.dislikes?.find(element => element.toString() === _id)
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(blogId, {$pull: {dislikes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            result: response
        })
    }
    const isLiked = blog?.likes?.find(element => element.toString() === _id)
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(blogId, {$pull: {likes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            result: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(blogId, {$push: {likes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            result: response
        })
    }
     
})

module.exports = {
    createBlog,
    getAllBlogs,
    updateBlog,
    deleteBlog,
    likeBlog,
}