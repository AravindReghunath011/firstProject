const  User  = require("../models/userModel");
const productModel = require('../models/productModel');
const mongodb = require('mongodb')

module.exports={
    getCartPage:async(req,res)=>{
        try{
            let user = req.session.isLoggedIn
            
            let oid = new mongodb.ObjectId(user._id)
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
           console.log(cartProducts,'dfghjklkjhgfdfghjkjhgfdfghj');
            res.render('users/cart',{cart:cartProducts,isLoggedIn:req.session.isLoggedIn})
        }catch(err){
            console.log(err.message);
        }
    },
    addToCart:async(req,res)=>{
        try {
            console.log(req.body,'req1qqqkkkkkkkkkkkkkkkkkk');
            let userId = req.session.isLoggedIn._id
            let user = await User.findById(userId)
            console.log(user.cart ,'product diiiiiiiiiiiiiii');
            console.log(req.query.id);
            let userExist = await User.findOne({$and:[{_id:userId},{'cart.productId':req.query.id}]})
        
               
            
            if(userExist){
                console.log('iffffffffffffff');
                let productExist  =  user.cart.find(item => item.productId==req.query.id)
                let quantity = parseInt(req.body.quantity)
                let existqa = parseInt(productExist.quantity)
                let newqa = quantity+existqa
                console.log(newqa,'fgggfggfhffggffghfghfghfgfhfhgfghfh');
                await User.updateOne({'cart.productId':req.query.id},
                {$set:{'cart.$.quantity':newqa}

                }).then((status)=>{
                    if(status){
                        console.log('success');
                        res.send('success')
                    }else{
                        console.log('failed');
                    }
                })

            }else{
                console.log('elsesseeeeeeeeeeeee');
                let quantity = parseInt(req.body.quantity)
                await User.findByIdAndUpdate(userId,{
                    $push:{cart:{productId:req.query.id,
                    quantity:quantity}}
                }).then((status)=>{
                    if(status){
                        console.log('success');
                        res.send('success')
                    }else{
                        console.log('failed');
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
        let id = req.session.isLoggedIn._id
        let proId = req.body.proId
        console.log(proId);
        console.log(req.session.isLoggedIn);
        User.updateOne({_id:id},{ $pull: { cart: { productId: proId } } }).then((status)=>{
            console.log('heloo froom controller');
            res.json({status:true})
        })
    }
}