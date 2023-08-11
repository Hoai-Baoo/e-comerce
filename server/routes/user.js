const router = require('express').Router()
const ctrls = require('..\\controllers\\user')
const {verifyAcessToken, isAdmin} = require('..\\middlewares\\verifyToken')

router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
router.get('/current', verifyAcessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.get('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.get('/', [verifyAcessToken, isAdmin], ctrls.getUsers)
router.delete('/', [verifyAcessToken, isAdmin], ctrls.deleteUser)
router.put('/personal', [verifyAcessToken], ctrls.updateUserPersonal)
router.put('/:userId', [verifyAcessToken, isAdmin], ctrls.updateUserAdmin)


module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE