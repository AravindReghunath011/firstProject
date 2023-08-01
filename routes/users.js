var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login',userController.userLogin)

router.get('/signup',userController.getSignup)
router.post('/signup',userController.userSignup)
router.get('/otp',(req,res)=>{
  res.render('users/signup')
})

module.exports = router;
