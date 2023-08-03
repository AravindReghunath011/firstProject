var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

/* GET home page. */
router.get('/',userController.getHome);

router.get('/login',userController.getUserlogin)

router.post('/login',userController.userLogin)

router.get('/signup',userController.getSignup)
router.post('/signup',userController.userSignup)
router.post('/otp/:id',userController.getOtp)

router.get('/otpforLogin',userController.getotpforLogin)
router.post('/otpforLogin',userController.verifyEmail)
router.post('/otpconfirm/:id',userController.verifyOtp)
module.exports = router;
