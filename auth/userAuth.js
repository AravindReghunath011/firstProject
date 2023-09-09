const User = require('../models/userModel')
const mongodb = require('mongodb')
const mongoose = require('mongoose')

module.exports = {
    isLoggedIn:async(req,res,next)=>{
        try {
            if(req.session.isLoggedIn){
            let user = await User.findById(req.session.isLoggedIn._id)
            console.log(user);
            if(user.isVarified==1){
                next()
            }
        }else{
            console.log('auth else');
            res.redirect('/login')
        }
            
        } catch (error) {
            console.log(error.message);
        }
    }
}