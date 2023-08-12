const router = require('express').Router()
const ctrls = require('..\\controllers\\blog')
const {verifyAcessToken, isAdmin} = require('..\\middlewares\\verifyToken')
const uploader = require('..\\config\\cloudinary.config')


router.post('/', [verifyAcessToken, isAdmin], ctrls.createBlog)
router.get('/',  ctrls.getAllBlogs)
router.get('/getone/:blogId',  ctrls.getOneBlog)
router.put('/like/:blogId', [verifyAcessToken], ctrls.likeBlog)
router.put('/dislike/:blogId', [verifyAcessToken], ctrls.dislikeBlog)

router.put('/upload-image/:blogId', [verifyAcessToken, isAdmin], uploader.single('image'), ctrls.uploadImageBlog)
router.put('/:blogId', [verifyAcessToken, isAdmin], ctrls.updateBlog)
router.delete('/:blogId', [verifyAcessToken, isAdmin], ctrls.deleteBlog)


module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE