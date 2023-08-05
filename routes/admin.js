var express = require('express');
var router = express.Router();
const multer = require('multer')
var path = require('path');
const categoryUpload = require('../multer/category')
const productUpload = require('../multer/productMulter')

const productController = require('../controllers/productController')
const categoryController = require('../controllers/categroyController')


/* GET users listing. */
router.get('/', categoryController.getDashboard);

router.get('/categories',categoryController.getCategory)

router.post('/categories',categoryUpload.single('image'), categoryController.addCategory)

router.get('/products',productController.getAddproduct)

router.post('/products',productUpload.array('images',4), productController.addProducts)


module.exports = router;
