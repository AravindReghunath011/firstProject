const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const nodemailer =require('nodemailer')
const config = require('../config/config')

module.exports ={
    getUserlogin:(req,res)=>{
        res.render('users/login')

    },
    userLogin:async(req,res)=>{
        console.log(req.body);
        let user = await User.findOne({email:req.body.email}).lean()
        if(user){
            bcrypt.compare(req.body.password,user.password).then((status)=>{
                if(user.isVarified==1){
                    res.redirect('/')
                }else{
                    console.log('moonji');
                }

            }).catch((err)=>{
                console.log(err.message);
            })
            
           
        }
        
        

    },
    getHome:(req,res)=>{
        res.render('users/index');
    },


    getSignup:(req,res)=>{
        res.render('users/signup')
    },


    userSignup:async(req,res)=>{

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

                res.render('users/otp' )
                req.session.signupData = req.body
                
                
            }
        })

       
        
    },
    getOtp:async(req,res)=>{
        if(req.body.otp.join('')==req.session.otp){
            req.body.password = await bcrypt.hash(req.body.password,10)
                let use = new User({
                    name:req.body.name,
                    email:req.body.email,
                    mobile:req.body.number,
                    password:req.body.password,
                    isAdmin:0
                    
                })

                await use.save().then((data)=>{
                    console.log("Sucess" , req.session)
                    
                }).catch((err)=>{
                    console.log(err);
                })
            res.redirect('/')
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
            res.send('error occured')
        }
        res.render('users/otpPage',{otpErr:req.session.otpErr})
        req.session.otpErr = false
    },
    validOtp:(req,res)=>{
        if(req.body.otp.join('')==req.session.loginotp){
            res.send('login WIth otp success')
        }else{
            req.session.otpErr = true
            res.redirect('/otpPage')
        }
    }



   
    
}