const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const bannerModel = require('../models/bannerModel')
const { default: mongoose } = require('mongoose');
const couponGenerator = require('voucher-code-generator')
const couponModel = require('../models/couponModel')
const moment = require('moment')

module.exports = {
    getDashboard:async(req,res)=>{
        let orders = await orderModel.find()
        res.render('admin/admin-dashboard',{orders})
    },
    monthlyreport:async(req,res)=>{
        try {
            console.log('hleooo');
          const start = moment().subtract(30, 'days').startOf('day'); // Data for the last 30 days
          const end = moment().endOf('day');
          console.log(start);
          console.log(end);
      
          const orderSuccessDetails = await orderModel.find({
            createdOn: { $gte: start, $lte: end },
            status: 'pending' 
          });

          console.log(orderSuccessDetails,';;');
      
          const monthlySales = {};
      
          orderSuccessDetails.forEach(order => {
            const monthName = moment(order.createdOn).format('MMMM');
            if (!monthlySales[monthName]) {
              monthlySales[monthName] = {
                revenue: 0,
                productCount: 0,
                orderCount: 0,
                codCount: 0,
                razorpayCount: 0,
              };
            }
            monthlySales[monthName].revenue += order.GrandTotal;
            monthlySales[monthName].productCount += orderSuccessDetails.length;
            monthlySales[monthName].orderCount++;
      
            if (order.payment=== 'cod') {
              monthlySales[monthName].codCount++;
            } else if (order.payment === 'Razorpay') {
              monthlySales[monthName].razorpayCount++;
            } 
          });
      
          const monthlyData = {
            labels: [],
            revenueData: [],
            productCountData: [],
            orderCountData: [],
            codCountData: [],
            razorpayCountData: [],
          };
      
          for (const monthName in monthlySales) {
            if (monthlySales.hasOwnProperty(monthName)) {
              monthlyData.labels.push(monthName);
              monthlyData.revenueData.push(monthlySales[monthName].revenue);
              monthlyData.productCountData.push(monthlySales[monthName].productCount);
              monthlyData.orderCountData.push(monthlySales[monthName].orderCount);
              monthlyData.codCountData.push(monthlySales[monthName].codCount);
              monthlyData.razorpayCountData.push(monthlySales[monthName].razorpayCount);
            }
          }
          console.log(monthlyData);
      
          return res.json(monthlyData);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'An error occurred while generating the monthly report.' });
        }
      },
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
        res.render('admin/usersList',{users,noOfPages,page})
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

            res.render('admin/salesReport',{order,sales:'today'})
        
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

            res.render('admin/salesReport',{order,sales:'weekly'})
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
            res.render('admin/salesReport',{order,sales:'monthly'})
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

        res.render('admin/salesReport',{order,sales:'yearly'})
    },
    changeStatus:async(req,res)=>{
        console.log(req.query.id);
        if(req.body.status=='cancelled'){
            res.redirect('/admin/orderList') 
        }
        let order = await orderModel.findByIdAndUpdate(req.query.id,{status:req.body.status},{new:true})
        console.log(order);
        res.redirect('/admin/orderList')
    },
    addBanner:(req,res)=>{
        try {
            res.render('admin/addBanner',{err:req.session.bannerCropErr})
        } catch (error) {
            console.log(error.message);
        }
    },
    banner:async(req,res)=>{
        try {
            console.log(req.body);
            let newBanner = new bannerModel({
                name:req.body.name,
                description:req.body.description,
                image:req.file.filename
            })

             newBanner.save().then((status)=>{
                console.log(status);
                res.redirect('/admin/banner')
             })
            
            
        } catch (error) {
            console.log(error.message);
        }
    },
    getAddCoupon:(req,res)=>{
        try {
            res.render('admin/addCoupon')
        } catch (error) {
            console.log(error.message);
        }
    },
    addCoupon: async(req,res)=>{
        try {
            let couponCode = couponGenerator.generate({
                prefix: "promo-",
                charset: "Aravind"
            });
            couponCode = ''+couponCode
            console.log(req.body);
            let startDate = new Date(req.body.startDate)
            let expireDate = new Date(req.body.expireDate)
            console.log(startDate);

            let newCoupon = new couponModel({
                name:req.body.name,
                couponCode:couponCode,
                created:startDate,
                expiry:expireDate,
                offerPrice:req.body.offerPrice,
                minPrice:req.body.minPrice
            })
            await newCoupon.save()
            console.log(newCoupon);
            res.redirect('/admin/addCoupon')

        } catch (error) {
            console.log(error.message);
        }
    }
    

    
    
}