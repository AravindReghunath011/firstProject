const mongoose =  require('mongoose');


let bannerModel = new mongoose.Schema({
    name:{
        type:String,
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

module.exports = mongoose.model('banner' , bannerModel)

