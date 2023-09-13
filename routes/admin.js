const express = require('express');
const router = express.Router();
const categoryUpload = require('../multer/category')
const productUpload = require('../multer/productMulter')
const bannerUpload = require('../multer/banner')
const bannerCrop = require('../config/crop')
const productCrop = require('../config/productCrop')

const productController = require('../controllers/productController')
const categoryController = require('../controllers/categroyController')
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');


/* GET users listing. */
router.get('/', adminController.getDashboard);
router.get('/adminLogin',adminController.getadminLogin)
router.get('/categories',categoryController.getCategory)
router.get('/products',productController.getAddproduct)
router.get('/productList',productController.adminProductList)
router.get('/usersList',adminController.usersList) 
router.get('/block-user',adminController.blockUser)
router.get('/unblock-user',adminController.unblockUser)
router.get('/getEditProduct',productController.getEditProduct)
router.get('/editCategory',categoryController.getEditCategory)
router.get('/list',categoryController.list)
router.get('/unlist',categoryController.unlist)
router.get('/orderList',adminController.orderList)
router.get('/salesToday',adminController.salesToday)
router.get('/salesWeekly',adminController.salesWeekly)
router.get('/salesMonthly',adminController.salesMonthly)
router.get('/salesYearly',adminController.salesYearly)
router.get('/orderDetailsAdmin',orderController.orderDetailsAdmin)
router.get('/banner',adminController.addBanner)
router.get('/addCoupon',adminController.getAddCoupon)
router.get('/deleteProduct',productController.deleteProduct)
router.get('/monthly-report',adminController.monthlyreport)





router.post('/adminLogin',adminController.adminLogin)
router.post('/categories',categoryUpload.single('image'), categoryController.addCategory)
router.post('/getEditProduct',productUpload.array('images',4),productController.editProduct)
router.post('/editCategory',categoryUpload.single('image'),categoryController.editCategory)
router.post('/products',productUpload.array('images',4),productCrop.productCrop, productController.addProducts)
router.post('/changeStatus',adminController.changeStatus)
router.post('/banner',bannerUpload.single('image'),bannerCrop.bannerCrop,adminController.banner)
router.post('/addCoupon',adminController.addCoupon)



module.exports = router;
