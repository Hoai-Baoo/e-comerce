const router = require('express').Router()
const ctrls = require('..\\controllers\\order')
const {verifyAcessToken, isAdmin} = require('..\\middlewares\\verifyToken')


router.post('/', [verifyAcessToken], ctrls.createOrder)
router.put('/status/:orderId', [verifyAcessToken, isAdmin], ctrls.updateStatusOrder)
router.get('/', [verifyAcessToken], ctrls.getUserOrder)
router.get('/admin', [verifyAcessToken, isAdmin], ctrls.getALlOrderAdmin)



module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE