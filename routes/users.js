var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const categoryController = require('../controllers/categroyController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController');



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
router.get('/forgetPassword',userController.getforgetPassword)
router.post('/forgetPassword',userController.validateNumber)
router.get('/forgetpassOtp',userController.getForgetpassOtp)
router.post('/forgetpassOtp',userController.checkOtp)
router.get('/getChangepass',userController.getChangePass)
router.post('/getChangepass',userController.changePass)
router.get('/getCategoryList',categoryController.userCategroyList)
router.get('/productDetails',productController.productDetails)
router.get('/cart',cartController.getCartPage) 
router.post('/cart',cartController.addToCart) 
router.get('/profile',userController.getProfilePage) 
router.post('/change-quantity',cartController.quantityChange)
router.post('/removeProductFromCart',cartController.removeProduct)
router.get('/address',userController.getAddressPage)
router.post('/address',userController.address) 
router.get('/editAddress',userController.getEditAddress)
router.post('/editAddress',userController.editAddress) 
router.post('/deleteAddress',userController.deleteAddress)  
router.get('/buy',cartController.buyProduct)
router.post('/makePurchase',cartController.makePurchase)
router.get('/orderDetails',orderController.userOrderDetails)
router.get('/orderList',orderController.userOrderList)
router.get('/wishList',userController.getWishlist)
router.post('/wishList',userController.wishList)
router.post('/searchProd',productController.searchProd)
router.post('/searchCategory',categoryController.searchCategory)
router.post('/verifyPayment',cartController.verify)
router.get('/cancelOrder',orderController.cancel)
router.post('/removeProductFromWishList',userController.removeProductFromWishlist)
router.get('/addressFromPurchase',userController.addressFromPurchase)










router.get('/logout',userController.logout)
module.exports = router;
