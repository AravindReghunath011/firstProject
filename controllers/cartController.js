const  db  = require("../models/userModel");
const productModel = require('../models/productModel');

module.exports={
    getCartPage:(req,res)=>{
        try{
            res.render('users/cart')
        }catch(err){
            console.log(err.message);
        }
    },
    addToCart:async(req,res)=>{
        try {
            console.log(req.body,'req1qqqkkkkkkkkkkkkkkkkkk');
            let userId = req.session.isLoggedIn._id
            let user = await db.findById(userId)
            console.log(user.cart ,'product diiiiiiiiiiiiiii');
            console.log(req.query.id);
            let userExist = await db.findOne({$and:[{_id:userId},{'cart.productId':req.query.id}]}, {_id:0,'cart.productId':1,'cart.quantity':1})
            
            
               
            
            if(userExist){
                console.log('iffffffffffffff');
                let productExist  =  user.cart.find(item => item.productId==req.query.id)
                let quantity = parseInt(req.body.quantity)
                let existqa = parseInt(productExist.quantity)
                let newqa = quantity+existqa
                console.log(newqa,'fgggfggfhffggffghfghfghfgfhfhgfghfh');
                await db.updateOne({'cart.productId':req.query.id},
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
                await db.findByIdAndUpdate(userId,{
                    $push:{cart:{productId:req.query.id,
                    quantity:req.body.quantity}}
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
    }
}