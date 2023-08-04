const mongoose =  require('mongoose');


let categoryModel = new mongoose.Schema({
    category:{
        type:String,
        required:true,
    },
    basePrice:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('category' , categoryModel)

