const mongoose =  require('mongoose');


let couponModel = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    couponCode:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    },
    offerPrice:{
        type:Number,
        required:true
    },
    minPrice:{
        type:Number,
        required:true
    },
    user:{
        type:Array,
    }
});

module.exports = mongoose.model('coupon' , couponModel)

