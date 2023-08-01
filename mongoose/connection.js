const mongoose =require('mongoose');

module.exports={
    connect(){
        mongoose.connect('mongodb://0.0.0.0:27017/furnitureShop',{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        .then(()=>{
            console.log("Database connected");
        }).catch((err)=>{
            console.log("connection failed",err);
        })
    }
}