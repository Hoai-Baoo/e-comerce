const router = require('express').Router()
const ctrls = require('..\\controllers\\brand')
const {verifyAcessToken, isAdmin} = require('..\\middlewares\\verifyToken')

router.post('/', [verifyAcessToken, isAdmin], ctrls.createBrand)
router.get('/',  ctrls.getAllBrands)
router.put('/:brandId', [verifyAcessToken, isAdmin], ctrls.updateBrand)
router.delete('/:brandId', [verifyAcessToken, isAdmin], ctrls.deleteBrand)

module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE