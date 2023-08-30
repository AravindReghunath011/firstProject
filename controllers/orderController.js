const { ObjectId } = require("mongodb");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");


module.exports={ 
    userOrderDetails:async(req,res)=>{
        try {
            let oid = new ObjectId(req.query.id)
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
            console.log(productDetails[0].ProductDetails[0],'========================================999999999999999');
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

            console.log(user,'=-===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
            
            let orders =  await orderModel.aggregate([
                {$match:{userId:user._id}},
                {$unwind:'$products'},
                {$project:{
                    proId:{'$toObjectId':'$products.productId'},
                    quantity:'$products.quantity',
                    GrandTotal:'$GrandTotal',
                    orderedOn:'$createdOn'
                }},
                {$lookup:{
                    from:'products',
                    localField:'proId', 
                    foreignField:'_id',
                    as:'ProductDetails',
                }}
               
            ])
            console.log(orders[0].ProductDetails[0],'=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
            res.render('users/userOrderList',{orders})
            
        } catch (error) {
            console.log(error.message);
        }
    },
    
}