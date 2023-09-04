const mongodb = require("mongodb");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");


module.exports={ 
    userOrderDetails:async(req,res)=>{
        try {
            let oid = new mongodb.ObjectId(req.query.id)
            let productDetails =  await orderModel.aggregate([
                {$match:{_id:oid}},
                {$unwind:'$products'},
                {$project:{
                    proId:{'$toObjectId':'$products.productId'},
                    quantity:'$products.quantity',
                    GrandTotal:'$GrandTotal'  
                }},
                {$lookup:{
                    from:'products',
                    localField:'proId', 
                    foreignField:'_id',
                    as:'ProductDetails',
                }}
               
            ])
            let orders = await orderModel.findById(req.query.id)
            console.log(orders,'=================================');
            res.render('users/orderDetails',{orders,productDetails})
            
        } catch (error) {
            console.log(error.message);
        }
    },
    userOrderList:async(req,res)=>{
        try {
            let user = req.session.isLoggedIn
            let perPage = 5
            let page = req.query.p || 0
            console.log(page+perPage);

            console.log(user,'=-===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
            let oid = new mongodb.ObjectId(user._id)
            let orders =  await orderModel.aggregate([
                {$match:{userId:oid}},
                {$unwind:'$products'},
                {$project:{
                    proId:{'$toObjectId':'$products.productId'},
                    quantity:'$products.quantity',
                    GrandTotal:'$GrandTotal',
                    orderedOn:'$createdOn',
                    status:'$status'
                }},
                {$lookup:{
                    from:'products',
                    localField:'proId', 
                    foreignField:'_id',
                    as:'ProductDetails',
                }}
               
            ]).skip(perPage* page).limit(perPage)
            console.log(page,'ghjkhg');

            let noOfPages = await orderModel.find({userId:oid}).count()
            console.log(noOfPages,'ghjkl');
            noOfPages = noOfPages/perPage
           
            res.render('users/userOrderList',{orders,noOfPages})
            
        } catch (error) {
            console.log(error.message);
        }
    },
    orderDetailsAdmin:async(req,res)=>{
        console.log('helo');
        let order = await orderModel.findById(req.query.id)
        console.log(order);
        res.render('admin/orderDetailsAdmin',{order})
    },
    cancel:async(req,res)=>{
        let orderToCancel = await orderModel.findByIdAndUpdate(req.query.id,{status:-1},{new:true})
        console.log(orderToCancel);
        res.redirect('/orderList')

    }
    
}