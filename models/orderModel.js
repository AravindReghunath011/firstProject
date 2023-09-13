const mongoose =  require('mongoose');


let orderModel = new mongoose.Schema({
    address:{
        type:Object,
        required:true,
    },
    GrandTotal:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number
    },
    status:{
        type:String,
        default:0
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    payment:{
        type:String,
        required:true
    },
    products:{
        type:Array,
        required:true
    },
    createdOn:{
        type:Date,
        required:true
    }
});

module.exports = mongoose.model('order' ,orderModel)

