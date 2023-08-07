const mongoose =  require('mongoose');


let userModel = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Number,
        required:true
    },
    isVarified:{
        type:Number,
        default:0
    },
    
});

module.exports = mongoose.model('User' , userModel)

