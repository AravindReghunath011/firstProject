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
            subject:'CycleShop otp varification',
            text:`Thank you for choosing CycleShop. Use the following OTP to complete your Sign Up procedures. ${otp} `
        }
        transport.sendMail(mailObj ,async (err , status)=>{
            if(err){
                console.log('Err' , err)
            }else{
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
                    res.render('users/otp' ,{email:req.body.email , id:use._id})
                }).catch((err)=>{
                    console.log(err);
                })
                
            }
        })

       
        
    },
    getOtp:async(req,res)=>{
        let user = await User.findByIdAndUpdate(req.params.id,{isVarified:1})
        console.log(user);
        res.redirect('/')
    
       
    },

   
    
}