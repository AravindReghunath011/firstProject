const { ObjectId } = require('mongodb');
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
    profileImage:{
        type:String,
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
    wishList: [{
        proId:{
            type:mongoose.Types.ObjectId,
            default:null
        }
    }],
    wallet:{
        type:Number,
        default:0
    },
    walletHistory:{
        type:Array
    },
    referalCode:{
        type:String
    }
    
});

module.exports = mongoose.model('User' , userModel)

