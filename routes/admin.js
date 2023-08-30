const express = require('express');
const router = express.Router();
const categoryUpload = require('../multer/category')
const productUpload = require('../multer/productMulter')

const productController = require('../controllers/productController')
const categoryController = require('../controllers/categroyController')
const adminController = require('../controllers/adminController')


/* GET users listing. */
router.get('/', categoryController.getDashboard);

router.get('/adminLogin',adminController.getadminLogin)
router.post('/adminLogin',adminController.adminLogin)

router.get('/categories',categoryController.getCategory)

router.post('/categories',categoryUpload.single('image'), categoryController.addCategory)

router.get('/products',productController.getAddproduct)

router.post('/products',productUpload.array('images',4), productController.addProducts)

router.get('/productList',productController.adminProductList)

router.get('/usersList',adminController.usersList) 

router.get('/block-user',adminController.blockUser)
router.get('/unblock-user',adminController.unblockUser)
router.get('/getEditProduct',productController.getEditProduct)
router.post('/getEditProduct',productUpload.array('images',4),productController.editProduct)
router.get('/editCategory',categoryController.getEditCategory)
router.post('/editCategory',categoryUpload.single('image'),categoryController.editCategory)
router.get('/list',categoryController.list)
router.get('/unlist',categoryController.unlist)
router.get('/orderList',adminController.orderList)
router.get('/salesToday',adminController.salesToday)
router.get('/salesWeekly',adminController.salesWeekly)
router.get('/salesMonthly',adminController.salesMonthly)
// router.get('/salesYearly',adminController.salesYearly)



router.get('/deleteProduct',productController.deleteProduct)
module.exports = router;
