const BlogCategory = require('..\\models\\blogCategory')
const asyncHandler = require('express-async-handler')
// const slugify = require('slugify')

const createBlogCategory = asyncHandler(async(req, res) => {
    const response = await BlogCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        createdBlogCategory: response ? response : 'Cannot create new blog-category'
    })
})

const getAllBlogCategories = asyncHandler(async(req, res) => {
    const response = await BlogCategory.find().select('title _id')
    return res.json({
        success: response ? true : false,
        allBlogCategories: response ? response : 'Cannot get all blog categories'
    })
})

const updateBlogCategory = asyncHandler(async(req, res) => {
    const {blogCategoryId} = req.params
    const response = await BlogCategory.findByIdAndUpdate(blogCategoryId, req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updatedBlogCategory: response ? response : 'Cannot update the blog category'
    })
})

const deleteBlogCategory = asyncHandler(async(req, res) => {
    const {blogCategoryId} = req.params
    const response = await BlogCategory.findByIdAndDelete(blogCategoryId)
    return res.json({
        success: response ? true : false,
        deletedBlogCategory: response ? response : 'Cannot delete the blog category'
    })
})



module.exports = {
    createBlogCategory,
    getAllBlogCategories,
    updateBlogCategory,
    deleteBlogCategory,
}
