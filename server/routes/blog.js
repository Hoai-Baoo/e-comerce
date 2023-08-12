const router = require('express').Router()
const ctrls = require('..\\controllers\\blog')
const {verifyAcessToken, isAdmin} = require('..\\middlewares\\verifyToken')

router.post('/', [verifyAcessToken, isAdmin], ctrls.createBlog)
router.get('/',  ctrls.getAllBlogs)
router.put('/like', [verifyAcessToken], ctrls.likeBlog)

router.put('/:blogId', [verifyAcessToken, isAdmin], ctrls.updateBlog)
router.delete('/:blogId', [verifyAcessToken, isAdmin], ctrls.deleteBlog)


module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE