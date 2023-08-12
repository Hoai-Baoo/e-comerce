const router = require('express').Router()
const ctrls = require('..\\controllers\\blogCategory')
const {verifyAcessToken, isAdmin} = require('..\\middlewares\\verifyToken')

router.post('/', [verifyAcessToken, isAdmin], ctrls.createBlogCategory)
router.get('/',  ctrls.getAllBlogCategories)
router.put('/:blogCategoryId', [verifyAcessToken, isAdmin], ctrls.updateBlogCategory)
router.delete('/:blogCategoryId', [verifyAcessToken, isAdmin], ctrls.deleteBlogCategory)

module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE