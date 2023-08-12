const Brand = require('..\\models\\brand')
const asyncHandler = require('express-async-handler')
// const slugify = require('slugify')

const createBrand = asyncHandler(async(req, res) => {
    const response = await Brand.create(req.body)
    return res.json({
        success: response ? true : false,
        createdBrand: response ? response : 'Cannot create new brand'
    })
})

const getAllBrands = asyncHandler(async(req, res) => {
    const response = await Brand.find().select('title _id')
    return res.json({
        success: response ? true : false,
        allBrands: response ? response : 'Cannot get all brands'
    })
})

const updateBrand = asyncHandler(async(req, res) => {
    const {brandId} = req.params
    const response = await Brand.findByIdAndUpdate(brandId, req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updatedBrand: response ? response : 'Cannot update the brand'
    })
})

const deleteBrand = asyncHandler(async(req, res) => {
    const {brandId} = req.params
    const response = await Brand.findByIdAndDelete(brandId)
    return res.json({
        success: response ? true : false,
        deletedBrand: response ? response : 'Cannot delete the brand'
    })
})



module.exports = {
    createBrand,
    getAllBrands,
    updateBrand,
    deleteBrand,
}
