const mongoose =  require('mongoose');


let categoryModel = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    isListed:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('category' , categoryModel)

