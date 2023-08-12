const ProductCategory = require('..\\models\\productCategory')
const asyncHandler = require('express-async-handler')
// const slugify = require('slugify')

const createCategory = asyncHandler(async(req, res) => {
    const response = await ProductCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        createdCategory: response ? response : 'Cannot create new product-category'
    })
})

const getAllCategories = asyncHandler(async(req, res) => {
    const response = await ProductCategory.find().select('title _id')
    return res.json({
        success: response ? true : false,
        allProductCategories: response ? response : 'Cannot get all product categories'
    })
})

const updateCategory = asyncHandler(async(req, res) => {
    const {productCategoryId} = req.params
    const response = await ProductCategory.findByIdAndUpdate(productCategoryId, req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updatedCategories: response ? response : 'Cannot update the product category'
    })
})

const deleteCategory = asyncHandler(async(req, res) => {
    const {productCategoryId} = req.params
    const response = await ProductCategory.findByIdAndDelete(productCategoryId)
    return res.json({
        success: response ? true : false,
        deletedCategories: response ? response : 'Cannot delete the product category'
    })
})



module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
}
