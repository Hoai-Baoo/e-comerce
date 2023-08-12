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


const likeBlog = asyncHandler(async(req, res) => {
    const { _id} = req.user
    const {blogId} = req.params
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


const dislikeBlog = asyncHandler(async(req, res) => {
    const { _id} = req.user
    const {blogId} = req.params
    if (!blogId) throw new Error('Missing inputs')
    const blog = await Blog.findById(blogId)

    const isLiked = blog?.likes?.find(element => element.toString() === _id)
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(blogId, {$pull: {likes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            result: response
        })
    }
    const isDisliked = blog?.dislikes?.find(element => element.toString() === _id)
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(blogId, {$pull: {dislikes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            result: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(blogId, {$push: {dislikes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            result: response
        })
    } 
})


const getOneBlog = asyncHandler(async(req, res)=> {
    const {blogId} = req.params
    const blog = await Blog.findByIdAndUpdate(blogId, {$inc:{numberViewers: 1}}, {new: true})
        .populate('likes','firstname lastname')
        .populate('dislikes','firstname lastname')
    return res.json({
        success: blog ? true : false,
        result: blog
    })
})


module.exports = {
    createBlog,
    getAllBlogs,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    getOneBlog,
}