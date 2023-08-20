const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const orderModel = require('../models/orderModel')

module.exports = {
    getadminLogin:(req,res)=>{
        if(req.session.adminLogin){
            res.redirect('/')
        }else{
            res.render('admin/adminLogin')
        }
    },
    adminLogin:async(req,res)=>{
        
        let admin = await User.findOne({email:req.body.email,isAdmin:1})
        if(admin){
            bcrypt.compare(req.body.password,admin.password).then((status)=>{
                req.session.adminLogin = true
                res.redirect('/')
            }).catch((err)=>{
                console.log(err.message);
            })

        }
    },
    usersList:async(req,res)=>{
        let users = await User.find({isAdmin:0})
        console.log(users);
        console.log(users.isVarified);
        res.render('admin/usersList',{users})
    },
    blockUser:async(req,res)=>{
        id = req.query.id
        await User.findByIdAndUpdate(id,{isVarified:0})
        res.redirect('/admin/usersList')
    },
    unblockUser:async(req,res)=>{
        console.log('heloo');
        id = req.query.id
        await User.findByIdAndUpdate(id,{isVarified:1})
        res.redirect('/admin/usersList')
    },
    orderList:async(req,res)=>{
        try {
            
            let orders = await orderModel.find()
            console.log(orders);
            res.render('admin/orderList',{orders})
        } catch (error) {
            console.log(error.message);
        }
    }
    
}