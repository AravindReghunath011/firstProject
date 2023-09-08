const User = require('../models/userModel')
const mongodb = require('mongodb')
const mongoose = require('mongoose')

module.exports = {
    isLoggedIn:(req,res,next)=>{
        try {
            let user = User.findById(req.session.isLoggedIn._id)
            if(user.isVarified==1){
                next()
            }else{
                res.redirect('/login')
            }
            
        } catch (error) {
            console.log(error.message);
        }
    }
}