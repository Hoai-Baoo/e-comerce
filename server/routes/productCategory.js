const router = require('express').Router()
const ctrls = require('..\\controllers\\productCategory')
const {verifyAcessToken, isAdmin} = require('..\\middlewares\\verifyToken')

router.post('/', [verifyAcessToken, isAdmin], ctrls.createCategory)
router.get('/',  ctrls.getAllCategories)
router.put('/:productCategoryId', [verifyAcessToken, isAdmin], ctrls.updateCategory)
router.delete('/:productCategoryId', [verifyAcessToken, isAdmin], ctrls.deleteCategory)

module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE