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
    status:{
        type:Number,
        default:0
    },
    userId:{
        type:String,
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
        type:String,
        required:true
    }
});

module.exports = mongoose.model('order' ,orderModel)

