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



router.get('/otpLoginPage',userController.getloginOtpPage)
router.post('/otpLoginPage',userController.redirectToOtp)
router.get('/otpPage',userController.getOtpPage)
router.post('/otpPage',userController.validOtp)
module.exports = router;
