const Product = require('..\\models\\product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler( async(req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true :  false,
        createdProduct: newProduct ? newProduct : 'Cannot create the new product'
    })
})


const getOneProduct = asyncHandler( async(req, res) => {
    const {productId} = req.params
    const product = await Product.findById(productId)
    return res.status(200).json({
        success: product ? true :  false,
        productData: product ? product : 'Cannot get the product'
    })
})

//Filtering, sorting & pagination
const getAllProducts = asyncHandler( async(req, res) => {
    const products = await Product.find()
    return res.status(200).json({
        success: products ? true :  false,
        productsData: products ? products : 'Cannot get all products'
    })
})

const updateOneProduct = asyncHandler( async(req, res) => {
    const {productId} = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {new: true})
    return res.status(200).json({
        success: updatedProduct ? true :  false,
        updatedProductData: updatedProduct ? updatedProduct : 'Cannot update the product'
    })
})

const deleteOneProduct = asyncHandler( async(req, res) => {
    const {productId} = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const deletedProduct = await Product.findByIdAndDelete(productId)
    return res.status(200).json({
        success: deletedProduct ? true :  false,
        deletedProductData: deletedProduct ? deletedProduct : 'Cannot delete the product'
    })
})


module.exports = {
    createProduct,
    getOneProduct,
    getAllProducts,
    updateOneProduct,
    deleteOneProduct,
}