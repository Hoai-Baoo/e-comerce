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
    const queries = {...req.query}
    // Extract special fields from query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(element => delete queries[element])   

    // Format operators to mongoose corrected syntax
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedElement => `$${matchedElement}`) //add $ sign
    const formatedQueries = JSON.parse(queryString)

    // Filtering 
    if (queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'} // Case insensitive
    let queryCommand = Product.find(formatedQueries)

    // Sorting
    if (req.query.sort) {
        // 'quantity,title' => [quantity,title] => 'quantity title'
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    // Fields limiting
    // Pagination

    // Execute query (in mogoose >7.0 use then and catch instead of .exec() )
    // Amount of products satisfy the condition !== Amount of products return after calling API
    queryCommand
        .then(async (response) => {
            const counts = await Product.find(formatedQueries).countDocuments()
            return res.status(200).json({
                success: response ? true :  false,
                productsData: response ? response : 'Cannot get all products',
                counts
            })
        }).catch((err) => {
                if (err) throw new Error(err.message)
            }) 

    // const products = await Product.find()
    
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