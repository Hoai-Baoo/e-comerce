const router = require('express').Router()
const ctrls = require('..\\controllers\\product')
const {verifyAcessToken, isAdmin} = require('..\\middlewares\\verifyToken')
const uploader = require('..\\config\\cloudinary.config')

router.post('/', [verifyAcessToken, isAdmin], ctrls.createProduct)
router.get('/', ctrls.getAllProducts)
router.put('/ratings', verifyAcessToken, ctrls.ratings)



router.put('/upload-image/:productId', [verifyAcessToken, isAdmin], uploader.single('images'), ctrls.uploadImagesProduct)
router.put('/:productId', [verifyAcessToken, isAdmin], ctrls.updateOneProduct)
router.delete('/:productId', [verifyAcessToken, isAdmin], ctrls.deleteOneProduct)
router.get('/:productId', ctrls.getOneProduct)

module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE