const mongodb = require("mongodb");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const User = require('../models/userModel')
const { findById } = require("../models/userModel");
const couponModel = require("../models/couponModel");
const easyinvoice = require('easyinvoice');
const fs = require('fs')
const { Readable } = require("stream")



module.exports={ 
    userOrderDetails:async(req,res)=>{
        try {
            let oid = new mongodb.ObjectId(req.query.id)
            let productDetails =  await orderModel.aggregate([
                {$match:{_id:oid}},
                {$unwind:'$products'},
                {$project:{
                    proId:{$toObjectId:'$products.productId'},
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
            console.log(productDetails,'=================================');
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
                    payment:'$payment',
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
            console.log(orders,'000000rrrrrrrrrrrrrrrrr0rrooo');

            let noOfPages = await orderModel.find({userId:oid}).count()
            
            noOfPages = noOfPages/perPage
            noOfPages = Math.round  (noOfPages)
            console.log(noOfPages,'ghjkl');
           
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
        try {
            let orderToCancel = await orderModel.findByIdAndUpdate(req.query.id,{status:'cancelled'},{new:true})
            
        console.log(orderToCancel,'hhhhhhhhhhhhhhhhhhhhhhhhhhhh'); 
        if(orderToCancel.payment=='razorpay'){
            let user = await User.findByIdAndUpdate(req.session.isLoggedIn,{$inc : {wallet : orderToCancel.GrandTotal}},{new:true})
            console.log(user);
        }
        res.redirect('/orderList')
        } catch (error) {
            console.log(error.message);
        }

    },
    buyNow:async(req,res)=>{
        console.log(req.body);
       
       let user = req.session.isLoggedIn
        console.log(user,'iiiiiiiiiiii');
        if(!user){
            res.redirect('/login')
        }else{
            let userData = await User.findById(req.session.isLoggedIn._id)
        
        let productDetails = await productModel.find({_id:req.query.id})
        let GrandTotal = productDetails[0].promotionalPrice * parseInt(req.body.quantity)
        let coupons = await couponModel.find({ minPrice: { $lte: GrandTotal } })

        console.log(userData);
        console.log(productDetails,'pppppppppppp'); 
        console.log(GrandTotal);

        if(productDetails[0].unit==0){
            req.session.stockErr = 'No stock left'
            res.redirect('/productDetails?id='+productDetails[0]._id)
        }else{
            console.log('heheheh');
        
        res.render('users/orderPage',{userData,productDetails,GrandTotal,from:'productDetails',coupons})
        }
        }
    },
    applyCoupon: async(req,res)=>{
        console.log(req.body);
        let coupon = await couponModel.findOne({couponCode:req.body.couponCode})
        if(coupon){
            let GrandTotal = parseInt(req.body.GrandTotal) - parseInt(coupon.offerPrice)
            console.log(GrandTotal ,'kkkkkkkkkk');
            res.json({status:true,GrandTotal:GrandTotal,offer:coupon.offerPrice}) 
        }else{
            res.json({status:false})
        }
    },
    changeStatus:async(req,res)=>{
        try {
            if(req.body.from == 'user'){
            if(req.body.status == 'All'){
                console.log(req.body.status);
                let oid = new mongodb.ObjectId(req.session.isLoggedIn._id)
                let orders =  await orderModel.aggregate([
               
                    {$match:{userId:oid}},
                    {$unwind:'$products'},
                    {$project:{
                        proId:{'$toObjectId':'$products.productId'},
                        quantity:'$products.quantity',
                        GrandTotal:'$GrandTotal',
                        orderedOn:'$createdOn',
                        payment:'$payment',
                        status:'$status'
                    }},
                    {$lookup:{
                        from:'products',
                        localField:'proId', 
                        foreignField:'_id',
                        as:'ProductDetails',
                    }}
                   
                ])
                
                res.json({orders})
            }else{

                let oid = new mongodb.ObjectId(req.session.isLoggedIn._id)
            console.log(oid,'kkkk');
            let orders =  await orderModel.aggregate([
               
                {$match:{status:req.body.status,userId:oid}},
                {$unwind:'$products'},
                {$project:{
                    proId:{'$toObjectId':'$products.productId'},
                    quantity:'$products.quantity',
                    GrandTotal:'$GrandTotal',
                    orderedOn:'$createdOn',
                    payment:'$payment',
                    status:'$status'
                }},
                {$lookup:{
                    from:'products',
                    localField:'proId', 
                    foreignField:'_id',
                    as:'ProductDetails',
                }}
               
            ])
            console.log(orders,'iiiiiiii');
            res.json({orders})

           
        }
    }else{
        if(req.body.status == 'All'){
            console.log(req.body.status);
           
            let orders =  await orderModel.aggregate([
           
                
                {$unwind:'$products'},
                {$project:{
                    proId:{'$toObjectId':'$products.productId'},
                    quantity:'$products.quantity',
                    GrandTotal:'$GrandTotal',
                    orderedOn:'$createdOn',
                    payment:'$payment',
                    status:'$status'
                }},
                {$lookup:{
                    from:'products',
                    localField:'proId', 
                    foreignField:'_id',
                    as:'ProductDetails',
                }}
               
            ])
            
            res.json({orders})
        }else{

            let oid = new mongodb.ObjectId(req.session.isLoggedIn._id)
        console.log(oid,'kkkk');
        let orders =  await orderModel.aggregate([
           
            {$match:{status:req.body.status,}},
            {$unwind:'$products'},
            {$project:{
                proId:{'$toObjectId':'$products.productId'},
                quantity:'$products.quantity',
                GrandTotal:'$GrandTotal',
                orderedOn:'$createdOn',
                payment:'$payment',
                status:'$status'
            }},
            {$lookup:{
                from:'products',
                localField:'proId', 
                foreignField:'_id',
                as:'ProductDetails',
            }}
           
        ])
        console.log(orders,'iiiiiiii');
        res.json({orders})

       
    }

    }
               
            
            
        } catch (error) {
            console.log(error.message);
        }
    },
    invoice:async(req,res)=>{
        try {
            const id = req.query.id;
            const userId = req.session.isLoggedIn._id;
            const result = await orderModel.findOne({ _id: id });
            const user = await User.findOne({ _id: userId });
            console.log(user);
        
            const address = result.address

                console.log(address);
            const order = {
              id: id,
              total: result.GrandTotal,
              date: result.createdOn, // Use the formatted date
              paymentMethod: result.payment,
              orderStatus: result.status,
              name: address.name,
              number: address.number,
              pincode: address.pincode,
              town: address.town,
              state: address.state,
              product: result.products,
            };
            //set up the product
            let oid = new mongodb.ObjectId(id)
            let Pname =  await orderModel.aggregate([
                {$match:{_id:oid}},
                {$unwind:'$products'},
                {$project:{
                    proId:{$toObjectId:'$products.productId'},
                    quantity:'$products.quantity',
                    GrandTotal:'$GrandTotal'  
                }},
                {$lookup:{ 
                    from:'products',
                    localField:'proId',
                    foreignField:'_id',
                    as:'ProductDetails',
                }},
                {
                    $project: {
                        quantity: '$quantity',
                        description: { $arrayElemAt: ['$ProductDetails.name', 0] },
                        price: { $arrayElemAt: ['$ProductDetails.promotionalPrice', 0] },
                        total: '$GrandTotal',
                        "tax-rate": '1',
                        _id:0
                    }
                }
            ])
            console.log(Pname[0],'[[[[[');
            
            const products = order.product.map((product,i) => ({
              quantity: parseInt(product.quantity),
              description: Pname[i].description,
              price: parseInt(product.price),
              total: parseInt(product.price * product.quantity),
              "tax-rate": 0,
            }));
            console.log(Pname,'ooo');
            const isoDateString = order.date;
            const isoDate = new Date(isoDateString);
        
            const options = { year: "numeric", month: "long", day: "numeric" };
            const formattedDate = isoDate.toLocaleDateString("en-US", options);
            const data = {
              customize: {
                //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
              },
              images: {
                // The invoice background
                background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
              },
              // Your own data
              sender: {
                company: "Future furniture",
                address: "Future furniture pala",
                city: "Kottayam",
                country: "India",
              },
              client: {
                company: "Customer Address",
                "zip": order.pincode,
                "city": order.locality,
                "address": order.name,
                // "custom1": "custom value 1",
                // "custom2": "custom value 2",
                // "custom3": "custom value 3"
              },
              information: {
                // Invoice number
                number: "order" + order.id,
                // ordered date
                date: formattedDate,
              },
              products: products,
              "bottom-notice": "Happy shoping and visit Future furniture again",
            };
        
            const pdfResult = await easyinvoice.createInvoice(data);
            const pdfBuffer = Buffer.from(pdfResult.pdf, "base64");
        
            // Set HTTP headers for the PDF response
            res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
            res.setHeader("Content-Type", "application/pdf");
        
            // Create a readable stream from the PDF buffer and pipe it to the response
            const pdfStream = new Readable();
            pdfStream.push(pdfBuffer);
            pdfStream.push(null);
        
            pdfStream.pipe(res);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        }
    
}