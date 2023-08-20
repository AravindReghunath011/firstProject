const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const nodemailer =require('nodemailer')
const config = require('../config/config');
const categoryModel = require('../models/categoryModel');
const { log } = require('debug/src/browser');
const client = require('twilio')('AC2ce54817f6f67c1a6af9d684612e68ae', '378ea4bd79a471225b8ac858848f636c');

module.exports ={
    getUserlogin:(req,res)=>{
        res.render('users/login',{err:req.session.loginPassErr,nouser:req.session.noUser})

    },
    userLogin:async(req,res)=>{        
        let user = await User.findOne({email:req.body.email}).lean()
        console.log(user);
        if(user){
            console.log(user.password);
            bcrypt.compare(req.body.password,user.password).then((status)=>{
                if(status){

                
                if(user.isVarified==1){
                    
                    req.session.isLoggedIn = user
                    res.redirect('/')
                }else{
                    req.session.loginPassErr = true
                    res.redirect('/login')

                }
            }else{
                req.session.loginPassErr=true
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
        console.log(category[0].name);
        
        res.render('users/index',{isLoggedIn:req.session.isLoggedIn,category});
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
        if(req.body.otp.join('')==req.session.otp){
            let spassword = await bcrypt.hash(req.session.signupData.password,10)
                let use = new User({
                    name: req.session.signupData.name,
                    email: req.session.signupData.email,
                    mobile: req.session.signupData.number,
                    password: spassword,
                    isAdmin:0,
                    isVarified:1
                    
                })

                await use.save().then((data)=>{
                    console.log(use.name);
                    req.session.isLoggedIn = use
                    res.redirect('/')
                    
                }).catch((err)=>{
                    console.log(err);
                })
                
            
        }else{
            res.send('wrong otp')
        }
        
    
       
    },


    getloginOtpPage:(req,res)=>{
        res.render('users/otpLoginPage')
    },

    
    redirectToOtp:async(req,res)=>{
        console.log('yep');
        let user = await User.findOne({email:req.body.email})
        console.log('nop');
        if(user){
            req.session.UserLoginOtpEmail = user.email
            res.redirect('/otpPage')
        }else{
            res.send('Enter valid email')
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
    getChangePass:(req,res)=>{
        res.render('users/changePass')
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
            res.render('users/addressPage',{isLoggedIn :req.session.isLoggedIn})
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
                console.log(newAddress);
                res.redirect('/profile')
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
    }
 


   
    
}