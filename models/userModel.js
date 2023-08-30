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
    cart:{
        type:Array
    },
    isVarified:{
        type:Number,
        default:0
    },
    address:{
        type:Array,
        default:[]
    },
    wishList:{
        type:Array,
        default:[]
    }
    
});

module.exports = mongoose.model('User' , userModel)

