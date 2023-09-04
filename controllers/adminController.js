const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const { default: mongoose } = require('mongoose');

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
        let usersPerPage = 2
        let page = parseInt(req.query.p) || 0
        
        
        let users = await User.find({isAdmin:0}).skip(usersPerPage * page).limit(usersPerPage)
        console.log(users);
        console.log(users.isVarified);
        let noOfPages = await User.find().count() /2
        noOfPages = Math.round(noOfPages) 
        console.log(noOfPages);
        res.render('admin/usersList',{users,noOfPages})
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
    },
    salesToday:async(req,res)=>{
        let todaysales = new Date()
        const startOfDay = new Date(
            todaysales.getFullYear(),
            todaysales.getMonth(),
            todaysales.getDate(),
            0,
            0,
            0,
            0
        );

        const endOfDay = new Date(
            todaysales.getFullYear(),
            todaysales.getMonth(),
            todaysales.getDate(),
            23,
            59,
            59,
            999
        );

        const order = await orderModel.find({
            
            createdOn: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        }).sort({ createdOn: -1 });

            console.log(order,'gggg');

            res.render('admin/salesReport',{order})
        
    },
    salesWeekly:async(req,res)=>{
        const currentDate = new Date();

        const startOfWeek = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay()
        );
        const endOfWeek = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + (6 - currentDate.getDay()),
            23,
            59,
            59,
            999
        );
        console.log(currentDate<endOfWeek);
        console.log(endOfWeek);

        const order = await orderModel.find({
            
            createdOn: {
                $gte: startOfWeek,
                $lt: endOfWeek
            }
        }).sort({ createdOn: -1 });

            console.log(order,'jjjjj');

            res.render('admin/salesReport',{order})
    },salesMonthly:async(req,res)=>{
        const thisMonth = new Date().getMonth() + 1;
        const startofMonth = new Date(
            new Date().getFullYear(),
            thisMonth - 1,
            1,
            0,
            0,
            0,
            0
        );
        const endofMonth = new Date(
            new Date().getFullYear(),
            thisMonth,
            0,
            23,
            59,
            59,
            999
        );

        const order = await orderModel.find({
            
            createdOn: {
                $gte: startofMonth,
                $lt: endofMonth
            }
        }).sort({ createdOn: -1 });

            console.log(order,'yyyyyyyy');
            res.render('admin/salesReport',{order})
    },
    salesYearly:async(req,res)=>{
        const today = new Date().getFullYear();
        const startofYear = new Date(today, 0, 1, 0, 0, 0, 0);
        const endofYear = new Date(today, 11, 31, 23, 59, 59, 999);


        const order = await orderModel.find({
            
            createdOn: {
                $lt: endofYear,
                $gte: startofYear,
            }
        }).sort({ createdOn: -1 });

        res.render('admin/salesReport',{order})
    },
    changeStatus:async(req,res)=>{
        console.log(req.query.id);
        if(req.body.status=='pending'){
             var status = 0
        }else if(req.body.status == 'completed'){
            var status = 1
        }else{
            res.redirect('/admin/orderList')    
        }
        let order = await orderModel.findByIdAndUpdate(req.query.id,{status:status},{new:true})
        console.log(order);
        res.redirect('/admin/orderList')
    },
    addBanner:(req,res)=>{
        res.render('admin/addBanner')
    },
    banner:(req,res)=>{
        console.log(req.file);
    }
    

    
    
}