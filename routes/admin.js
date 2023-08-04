var express = require('express');
var router = express.Router();
const multer = require('multer')
var path = require('path');


const categoryController = require('../controllers/categroyController')

let pathname = Date.now()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/upload/category');
    },
    filename: (req, file, cb) => {
      console.log(Date.now());
      console.log(path.extname(file.originalname));
      cb(null, Date.now()+'.webp');
    },
});
const upload = multer({ storage: storage });





/* GET users listing. */
router.get('/', categoryController.getDashboard);

router.get('/categories',categoryController.getCategory)




router.post('/categories',upload.single('image'), categoryController.addCategory)

module.exports = router;
