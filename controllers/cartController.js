const  User  = require("../models/userModel");
const productModel = require('../models/productModel');
const orderModel = require('../models/orderModel')
const mongodb = require('mongodb')

module.exports={
    getCartPage:async(req,res)=>{
        try{
            let user = req.session.isLoggedIn
            
       
            let oid = new mongodb.ObjectId(user._id)
            console.log('helo');
            var cartProducts = await User.aggregate([
                {$match:{_id:oid}},
                {$unwind:'$cart'},
                {$project:{
                    proId:{'$toObjectId':'$cart.productId'},
                    quantity:'$cart.quantity'
                }},
                {$lookup:{
                    from:'products', 
                    localField:'proId', 
                    foreignField:'_id',
                    as:'ProductDetails',
                }}
            ])
            console.log(cartProducts);

            let GrandTotal = 0
            for(let i=0;i<cartProducts.length;i++){
                let qua = parseInt(cartProducts[i].quantity);
                GrandTotal = GrandTotal+(qua*parseInt(cartProducts[i].ProductDetails[0].promotionalPrice))
            }
            console.log(GrandTotal,'=======.....................');
           
             
            
           
                
           console.log(cartProducts,'dfghjklkjhgfdfghjkjhgfdfghj');
            res.render('users/cart',{cart:cartProducts,isLoggedIn:req.session.isLoggedIn,GrandTotal})
        }catch(err){
            console.log(err.message);
        }
    },
    addToCart:async(req,res)=>{
        try {
            console.log(req.body,'================================================================')
            let userId = req.session.isLoggedIn._id
            let user = await User.findById(userId)
            let userExist = await User.findOne({$and:[{_id:userId},{'cart.productId':req.body.proId}]})
            let product = await productModel.findById(req.body.proId)

            if(userExist){
                console.log('iffffffffffffffffff');
                let productExist  =  user.cart.find(item => item.productId==req.body.proId)
                let quantity = parseInt(req.body.quantity)
                let existqa = parseInt(productExist.quantity)
                let newqa = quantity+existqa
                await User.updateOne({'cart.productId':req.body.proId},
                {$set:{'cart.$.quantity':newqa}

                }).then((status)=>{
                    if(status){
                        console.log('iffff trueeeeeeeeeeeeeeeeeeee');
                        res.json({status:true})
                      
                    }else{
                        console.log('ifff falseseeeeeeeeeeeeeeeeeeeeeeeeeeee');
                        console.log('failed');
                        res.json({status:false})
                    }
                })

            }else{
                console.log('elsesseeeeeeeeeeeee');
                let quantity = parseInt(req.body.quantity)
                await User.findByIdAndUpdate(userId,{
                    $push:{cart:{productId:req.body.proId,
                    quantity:quantity,
                    price:product.promotionalPrice}}
                }).then((status)=>{
                    if(status){
                        console.log('true');
                       res.json({status:true})
                    }else{
                        console.log('false');
                       res.json({status:false})
                    }
                })

            }   
            
        } catch (error) {
            console.log(error.message);
        }
    },
    quantityChange:(req,res)=>{
        console.log('heloooo');
        console.log(req.body);
        req.body.count = parseInt(req.body.count)
        req.body.quantity = parseInt(req.body.quantity)
        total = req.body.count + req.body.quantity
        console.log('total:' ,total);
        if(req.body.quantity>=1&&req.body.count==1||req.body.quantity>1&&req.body.count==-1){
            User.updateOne({'cart.productId':req.body.proId,_id:req.body.userId},{$set:{'cart.$.quantity':total}}).then((status)=>{
                res.json({status:false})
            })
        }
       

    },
    removeProduct:(req,res)=>{
        console.log('==========================================================helo');
        let id = req.session.isLoggedIn._id
        let proId = req.body.proId
        console.log(proId);
        console.log(req.session.isLoggedIn);
        User.updateOne({_id:id},{ $pull: { cart: { productId: proId } } }).then((status)=>{
            console.log('heloo froom controller');
            res.json({status:true})
        })
    },
    buyProduct:async(req,res)=>{
        let user = req.session.isLoggedIn
        let oid = new mongodb.ObjectId(user._id)
        let productDetails =  await User.aggregate([
            {$match:{_id:oid}},
            {$unwind:'$cart'},
            {$project:{
                proId:{'$toObjectId':'$cart.productId'},
                quantity:'$cart.quantity'
            }},
            {$lookup:{
                from:'products',
                localField:'proId', 
                foreignField:'_id',
                as:'ProductDetails',
            }}
        ])
        let GrandTotal = 0
        for(let i=0;i<productDetails.length;i++){
            let qua = parseInt(productDetails[i].quantity);
            GrandTotal = GrandTotal+(qua*parseInt(productDetails[i].ProductDetails[0].promotionalPrice))
        }

        let userData = await User.findById(user._id)
        console.log(userData.address[0 ],'prod');
        res.render('users/orderPage',{userData,productDetails,GrandTotal})
    },
    makePurchase:async(req,res)=>{
        console.log(req.body,'========================================================');
        req.body.GrandTotal = parseInt(req.body.GrandTotal)
        let user = req.session.isLoggedIn
        console.log(user._id);
        // let userData = await User.findById(user._id)
        // let address = await User.aggregate([{$unwind:'$address'},{$match:{'address._id':req.body.addressId}},{$project:{address:1}}])
        let oid = new mongodb.ObjectId(user._id)
        let data = await User.aggregate([
            {
                $match:{_id:oid}
            },
            {
                $unwind:'$address'
            },
            {
                $match:{'address._id': req.body.addressId}
            }

        ]) 
        console.log(data);
        const date = new Date();

            const day = date.getDate(); // Returns the day of the month (1-31)
            const month = date.getMonth() + 1; // Returns the month (0-11), so adding 1 to get 1-12
            const year = date.getFullYear(); // Returns the year (e.g., 2023)

            let createdOn = ` ${day}/${month}/${year}`
        
        let newOrder = new orderModel({
            address:data[0].address,
            products:data[0].cart,
            GrandTotal:req.body.GrandTotal,
            status:0,
            payment:req.body.payment,
            userId:user._id,
            createdOn:createdOn
        })

        newOrder.save().then((status)=>{
            console.log('=====================================================');
            console.log(status);
            res.json({status:true,id:newOrder._id})
        }).catch((err)=>{
            console.log(err.message);
        })
        
        
    }

}