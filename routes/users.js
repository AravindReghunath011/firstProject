var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const categoryController = require('../controllers/categroyController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController');
const profileUpload = require('../multer/profile');
const orderModel = require('../models/orderModel');
let auth = require('../auth/userAuth')



/* GET home page. */
router.get('/',userController.getHome);
router.get('/login',userController.getUserlogin)
router.get('/signup',userController.getSignup)
router.get('/otpLoginPage',userController.getloginOtpPage)
router.get('/otpPage',userController.getOtpPage)
router.get('/productList',productController.showProducts)
router.get('/forgetPassword',userController.getforgetPassword)
router.get('/forgetpassOtp',userController.getForgetpassOtp)
router.get('/getChangepass',userController.getChangePass)
router.get('/getCategoryList',categoryController.userCategroyList)
router.get('/productDetails',productController.productDetails)
router.get('/cart',auth.isLoggedIn,cartController.getCartPage) 
router.get('/profile',auth.isLoggedIn,userController.getProfilePage) 
router.get('/address',userController.getAddressPage)
router.get('/addressFromPurchase',userController.addressFromPurchase)
router.get('/editAddress',userController.getEditAddress)
router.get('/buy',cartController.buyProduct)
router.get('/orderDetails',auth.isLoggedIn,orderController.userOrderDetails)
router.get('/orderList',auth.isLoggedIn,orderController.userOrderList)
router.get('/wishList',auth.isLoggedIn,userController.getWishlist)
router.get('/cancelOrder',auth.isLoggedIn,orderController.cancel)
router.get('/wallet',auth.isLoggedIn,userController.wallet)
router.get('/invoice',auth.isLoggedIn,orderController.invoice)
router.get('/editProfile',auth.isLoggedIn,userController.getEditProfile)
router.get('/getReferal',userController.getReferal)
router.get('/logout',userController.logout)






router.post('/login',userController.userLogin)
router.post('/signup',userController.userSignup)
router.post('/otp',userController.getOtp)
router.post('/otpLoginPage',userController.redirectToOtp)
router.post('/otpPage',userController.validOtp)
router.post('/forgetPassword',userController.validateNumber)
router.post('/forgetpassOtp',userController.checkOtp)
router.post('/getChangepass',userController.changePass)
router.post('/cart',auth.isLoggedIn,cartController.addToCart) 
router.post('/change-quantity',cartController.quantityChange)
router.post('/removeProductFromCart',cartController.removeProduct)
router.post('/address',userController.address) 
router.post('/editAddress',userController.editAddress) 
router.post('/deleteAddress',userController.deleteAddress)  
router.post('/makePurchase',cartController.makePurchase)
router.post('/wishList',userController.wishList)
router.post('/searchProd',productController.searchProd)
router.post('/searchCategory',categoryController.searchCategory)
router.post('/verifyPayment',cartController.verify)
router.post('/removeProductFromWishList',userController.removeProductFromWishlist)
router.post('/editProfile',profileUpload.single('image'),userController.editProfile)
router.post('/buyNow',orderController.buyNow)
router.post('/applyCoupon',orderController.applyCoupon)
router.post('/changeStatus',orderController.changeStatus)
router.post('/categoryFilter',categoryController.categoryFilter)
router.post('/add-money',userController.addToWallet)
router.post('/confirmAddtoWallet',userController.confirmAddtoWallet)
router.post('/referalExist',userController.referalExist)




module.exports = router;
