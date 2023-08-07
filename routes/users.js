var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')

/* GET home page. */
router.get('/',userController.getHome);

router.get('/login',userController.getUserlogin)

router.post('/login',userController.userLogin)

router.get('/signup',userController.getSignup)
router.post('/signup',userController.userSignup)
router.post('/otp',userController.getOtp)



router.get('/otpLoginPage',userController.getloginOtpPage)
router.post('/otpLoginPage',userController.redirectToOtp)
router.get('/otpPage',userController.getOtpPage)
router.post('/otpPage',userController.validOtp)

router.get('/productList',productController.showProducts)
module.exports = router;
