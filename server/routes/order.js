const router = require('express').Router()
const ctrls = require('..\\controllers\\order')
const {verifyAcessToken, isAdmin} = require('..\\middlewares\\verifyToken')


router.post('/', [verifyAcessToken], ctrls.createOrder)


module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE