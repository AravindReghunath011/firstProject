const mongoose =  require('mongoose');
const { array } = require('../multer/category');


let productModel = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    unit:{
        type:Number,
        required:true
    },
    regularPrice:{
        type:Number,
        required:true
    },
    promotionalPrice:{
        type:Number,
        required:true
    },
    images:{
        type:Array,
        required:true

    }
    
});

module.exports = mongoose.model('product' , productModel)

