const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const nodemailer =require('nodemailer')
const config = require('../config/config');
const categoryModel = require('../models/categoryModel');
const mongodb = require('mongodb')
const { log } = require('debug/src/browser');
const bannerModel = require('../models/bannerModel');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const couponGenerator = require('voucher-code-generator')
const Razorpay = require('razorpay')
require('dotenv').config()
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

var instance = new Razorpay({ key_id:process.env.KEY_ID, key_secret: process.env.KEY_SECRET })


module.exports ={
    getUserlogin:(req,res)=>{
      
        
        res.render('users/login',{err:req.session.loginPassErr,nouser:req.session.noUser})
        req.session.loginPassErr = 'helo'
      

    },
    userLogin:async(req,res)=>{        
        let user = await User.findOne({email:req.body.email}).lean()
        console.log(user);
        if(user){
        
            bcrypt.compare(req.body.password,user.password).then((status)=>{
                if(status){

                
                if(user.isVarified==1){
                    
                    req.session.isLoggedIn = user
                    res.redirect('/')
                    
                }else{
                    req.session.loginPassErr = 'You have been blocked by admin'
                    res.redirect('/login')
                    console.log('hehe');
                    res.session.loginPassErr = ''
                    

                }
            }else{
                req.session.loginPassErr= 'wrong password'
                res.redirect('/login')
            }

            }).catch((err)=>{

                req.session.noUser = true
                res.redirect('/login')
            })
            
           
        }
        
        

    },
    getHome:async(req,res)=>{
        let category = await categoryModel.find({}).lean()
        let banner = await bannerModel.find()
        let products = await productModel.find().lean()
        console.log(products[0].name);
        
        res.render('users/index',{isLoggedIn:req.session.isLoggedIn,category,banner,products});
    },
    logout:(req,res)=>{
        req.session.isLoggedIn=false 
        res.redirect('/')
    },


    getSignup:(req,res)=>{
        res.render('users/signup',{emailExistErr:req.session.emailExistErr})
        req.session.emailExistErr = false
    },


    userSignup:async(req,res)=>{
        let emailExist = await User.findOne({email:req.body.email})
        
        if(emailExist){

            req.session.emailExistErr = true
            res.redirect('/signup')

        }else{

        otp = Math.floor(1000 + Math.random() * 9000).toString()
        req.session.otp = otp
        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:config.EMAIL,
                pass:config.PASSWORD
            }
        })
        var mailObj = {
            from:'aravindreghunath99@gmail.com',
            to:req.body.email,
            subject:'Future furniture otp varification',
            text:`Thank you for choosing Future furniture. Use the following OTP to complete your Sign Up procedures. ${otp} `
        }
        transport.sendMail(mailObj ,async (err , status)=>{
            if(err){
                console.log('Err' , err)
            }else{
                req.session.signupData = req.body
                res.render('users/otp' )
            }
        })

    }

       
        
    },
    getOtp:async(req,res)=>{
        let couponCode = couponGenerator.generate({
            length:8
         });
         couponCode = couponCode.toString()
       
        if(req.body.otp.join('')==req.session.otp){
            let spassword = await bcrypt.hash(req.session.signupData.password,10)
                let use = new User({
                    name: req.session.signupData.name,
                    email: req.session.signupData.email,
                    mobile: req.session.signupData.number,
                    password: spassword,
                    isAdmin:0,
                    isVarified:1,
                    referalCode:couponCode
                    
                })

                 use.save().then(async(data)=>{
                   
                    req.session.isLoggedIn = use
                    req.session.from = 'getOtp'
                    res.redirect('/getReferal')
                    
                }).catch((err)=>{
                    console.log(err);
                })
                
            
        }else{
            res.send('wrong otp')
        }
        
    
       
    },


    getloginOtpPage:(req,res)=>{
        console.log('helo');
        res.render('users/otpLoginPage',{err:false})
    },

    
    redirectToOtp:async(req,res)=>{
        console.log('yep');
        let user = await User.findOne({email:req.body.email})
        console.log('nop');
        if(user){
            req.session.UserLoginOtpEmail = user.email
            res.redirect('/otpPage')
        }else{
            res.render('users/otpLoginPage',{err:'Enter a valid email'})
        }
    },
    getOtpPage:async(req,res)=>{

        let user = await User.findOne({email:req.session.UserLoginOtpEmail})

        if(user){
            otp = Math.floor(1000 + Math.random() * 9000).toString()
            req.session.loginotp =otp
        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:config.EMAIL,
                pass:config.PASSWORD
            }
        })
        var mailObj = {
            from:'aravindreghunath99@gmail.com',
            to:req.session.UserLoginOtpEmail,
            subject:'Future furniture otp varification',
            text:`Thank you for choosing Future furniture. Use the following OTP to complete your Sign Up procedures. ${otp} `
        }
        transport.sendMail(mailObj ,async (err , status)=>{
            if(err){
                console.log('Err' , err)
            }else{
                res.render('users/otp4login',{id:user._id})
                
            }
        }) 
        }else{
            res.send('User doesnt exist')
        }
        res.render('users/otpPage',{otpErr:req.session.otpErr})
        req.session.otpErr = false
    },
    validOtp:(req,res)=>{
        if(req.body.otp.join('')==req.session.loginotp){
            req.session.isLoggedIn = 'helo'
            res.redirect('/')
        }else{
            req.session.otpErr = true
            res.redirect('/otpPage')
        }
    },
    getforgetPassword:(req,res)=>{
        res.render('users/forgetPassword')
    },
    validateNumber: async(req,res)=>{
        let userExist = await User.findOne({mobile:req.body.number})
        console.log(userExist);
        if(userExist){
            otp = Math.floor(1000 + Math.random() * 9000).toString()
            req.session.forgetPassOtp = otp
            req.session.forgetPassMob = req.body.number

            function sendOTP(){
            client.messages
                .create({
                body: `Thank you for choosing Future furniture. Use the following OTP to complete your Sign Up procedures. ${otp} `,
                to: '+917034450703', // Text your number
                from: '+15393287841', // From a valid Twilio number
                })
                .then((data)=>{
                    res.redirect('/forgetpassOtp')
                } );
        
            }
            sendOTP()

        }else{
            res.send('Error occured')
        }
    },
    getForgetpassOtp:(req,res)=>{
        res.render('users/forgetPassOtp')
    },
    checkOtp:(req,res)=>{
        if(req.body.otp.join('')==req.session.forgetPassOtp){
            console.log('got right');
            res.redirect('/getChangePass')

        }else{
            res.redirect('/forgetpassOtp')
        }
    },
    getChangePass:async(req,res)=>{
        let user = await User.findOne({mobile:req.session.forgetPassMob})
        console.log(user);
        res.render('users/changePass',{user})
    },
    changePass:async(req,res)=>{
        let spassword = await bcrypt.hash(req.body.password,10)
         await User.findOneAndUpdate({mobile:req.session.forgetPassMob},{password:spassword})
        res.redirect('/login')
        


    },
    getProfilePage:async(req,res)=>{
        try {
            console.log(req.session.isLoggedIn);
            let user = await User.findById(req.session.isLoggedIn._id)
            console.log(user.address[0]);
            res.render('users/userProfile',{user,isLoggedIn :req.session.isLoggedIn})
            
        } catch (error) {
            console.log(error.message);
        }
    },
    getAddressPage:(req,res)=>{
        try {
            res.render('users/addressPage',{isLoggedIn :req.session.isLoggedIn,status:1})
        } catch (error) {
            console.log(error.message);
        }
    },
    address:async(req,res)=>{
        try{
            console.log(req.body);
            let id = Date.now().toString()
            let newAddress = await User.updateOne({_id:req.session.isLoggedIn._id},{$push:{address:{
                _id:id,
                name:req.body.name,
                number:req.body.number,
                altNumber:req.body.altNumber,
                country:req.body.country,
                state:req.body.state,
                house:req.body.street,
                town:req.body.town,
                pincode:req.body.pinCode,
                landmark:req.body.landmark,
                house:req.body.house
            }}})

            if(newAddress){
                if(req.query.status==1){
                    res.redirect('/profile')
                }else{
                    res.redirect('/buy')
                }
                console.log(newAddress);
                
            }else{
                req.session.addAddressErr = true
                res.redirect('/address',{Err: req.session.addAddressErr})
            }

        }catch(err){
            console.log(err.message)
        }
    },
    getEditAddress:async(req,res)=>{
        try {
            console.log(req.query.id);
            let userAddress = await User.aggregate([
                {
                $unwind:'$address'
                },
                {$match:{'address._id':req.query.id}}
            ])
            console.log(userAddress[0].address, 'addresssss');
            res.render('users/editAddress',{userAddress,isLoggedIn :req.session.isLoggedIn})
        } catch (error) {
            console.log(error.message);
        }
    },
    editAddress:async(req,res)=>{
        try {
           let editedAddress = await User.updateOne({_id:req.session.isLoggedIn._id,'address._id':req.query.id},{$set:{
            'address.$.name':req.body.name,
            'address.$.number':req.body.number,
            'address.$.altNumber':req.body.altNumber,
            'address.$.country':req.body.country,
            'address.$.state':req.body.state,
            'address.$.house':req.body.house,
            'address.$.town':req.body.town,
            'address.$.pincode':req.body.pincode,
            'address.$.landmark':req.body.landmark,

           }
           
                
            })

            console.log(editedAddress,'editedAddresss');
            res.redirect('/profile')
            
        } catch (error) {
            console.log(error.message);
        }
    },
    deleteAddress:async(req,res)=>{
        try {
            console.log('===========================================');
            console.log(req.body.id,'quereyyyyyyyy');
        let dltAd = await User.updateOne({_id:req.session.isLoggedIn._id},{ $pull: { address: { _id: req.body.id } } })
        if(dltAd){
            res.json({status:true})
        }else{
            res.json({status:false})
        }
        
        
            
        } catch (error) {
            console.log(error.message);
        }
    },

    wishList:async(req,res)=>{
        let user = req.session.isLoggedIn
        let prodExist = await User.findOne({'wishList.proId':req.body.id,_id:user._id})
        console.log(prodExist);
        if(prodExist){ 
            
        }else{
            let newWishlist = await User.findByIdAndUpdate(user._id,{$push:{'wishList':{proId:req.body.id}}})
            console.log(newWishlist,'ppp');
        }
        
        

    },
    getWishlist:async(req,res)=>{
        let user = req.session.isLoggedIn
        if(!user){
            res.redirect('/login')
        }else{
        let oid = new mongodb.ObjectId(user._id)
        let wishlist =  await User.aggregate([
            {$match:{_id:oid}},
            {$unwind:'$wishList'},
            {$project:{      
                proId:{'$toObjectId':'$wishList.proId'},
                
            }},
            {$lookup:{
                from:'products',  
                localField:'proId', 
                foreignField:'_id',
                as:'ProductDetails',
            }}
        ])
        console.log(wishlist,'ghjk ');
        res.render('users/wishList',{wishList:wishlist,isLoggedIn:req.session.isLoggedIn})
    }
    },
    removeProductFromWishlist:async(req,res)=>{
        console.log('==========================================================helo');
        let id = req.session.isLoggedIn._id
        let proId = req.body.proId
        console.log(proId);
        console.log(req.session.isLoggedIn);
        User.updateOne({_id:id},{ $pull: { wishList: { proId: proId } } }).then((status)=>{
            console.log('heloo froom controller');
            res.json({status:true})
        })
    },
    addressFromPurchase:(req,res)=>{
        try {
            res.render('users/addressPage',{isLoggedIn :req.session.isLoggedIn,status:0})
        } catch (error) {
            console.log(error.message);
        }
    },
    getEditProfile: async(req,res)=>{
        try {
            let user = await userModel.findById(req.session.isLoggedIn._id)
            console.log(user);
            res.render('users/editProfile',{user,isLoggedIn:req.session.isLoggedIn})
            
        } catch (error) {
            console.log(error.message);
        }
    },
    editProfile:async(req,res)=>{
        try {
            console.log(req.file);
            if(req.file){
                let user = await userModel.findByIdAndUpdate(req.session.isLoggedIn._id,
                    {
                        name:req.body.name,
                        mobile:req.body.number,
                        profileImage:req.file.filename
                    })

            }else{
                let user = await userModel.findByIdAndUpdate(req.session.isLoggedIn._id,
                    {
                        name:req.body.name,
                        mobile:req.body.number,
                        
                    },{new:true})
                    console.log(user,'oo');

            }
            
            

            ;
            res.redirect('/editProfile')
        } catch (error) {
            console.log(error.message);
        }
    },
    wallet:async(req,res)=>{
        try {
            let user = await User.findById(req.session.isLoggedIn._id)
            console.log(user);

            res.render('users/wallet',{isLoggedIn:req.session.isLoggedIn,user})
        } catch (error) {
            console.log(error.message);
        }
    },
    addToWallet:(req,res)=>{       
        try{
           var options = {
               amount: req.body.total*100,  
               currency: "INR",
               receipt: ""+Date.now()
             };
             instance.orders.create(options, function(err, order) {
               if(err){
                   console.log("Error while creating order : ",err)
               }else{
                   res.json({order:order , razorpay:true})
               }
           })
       }catch(err){
           console.log(err) 
           res.send("Cannot add amount into your acccount");
       }
    },
       confirmAddtoWallet:async (req,res)=>{
        var details=req.body
        var amount=details['order[order][amount]']/100
        await User.findByIdAndUpdate(
                req.session.isLoggedIn._id,
                { $inc: { wallet: amount }} 
        )
    },
    getReferal:async(req,res)=>{
        try {
            res.render('users/referalCode',{from:req.session.from})
            
        } catch (error) {
            console.log(error.message);
        }
    },
    referalExist:async(req,res)=>{
        console.log('helo');
        console.log(req.body.from);
        if(req.body.from=='getOtp'){
            console.log('ifffffff');
            console.log('helo');
            let referalCode = await User.findOne({referalCode:req.body.referalCode})
            console.log(referalCode,'ppp');
            if(referalCode){
                console.log(req.session.signupData)
                let Code = await User.updateOne({referalCode:req.body.referalCode},{$inc:{wallet:5000}})
                let user = await User.updateOne({email:req.session.signupData.email},{$inc:{wallet:1000}})
                console.log(user,'okoko');
                res.json({status:true})
            }else{
                res.json({status:false})
            }
        }else{
            {
            console.log('else');
            res.json({status:'getHome'})
        }
        }
       
    }

 


   
    
}