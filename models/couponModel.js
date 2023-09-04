const mongoose =  require('mongoose');


let couponModel = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    created:{
        type:Date(),
        required:true
    },
    expiry:{
        type:Date(),
        required:true
    },
    user:{
        type:Array,
    }
});

module.exports = mongoose.model('coupon' , couponModel)

