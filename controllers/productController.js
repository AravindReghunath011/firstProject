const productModel = require('../models/productModel');
const productMulter = require('../multer/productMulter');
const categoryModel = require('../models/categoryModel')

module.exports={
    getAddproduct:async(req,res)=>{
        let Category = await categoryModel.find({}).lean()

        console.log(Category);
        console.log(Category[0].category);
        res.render('admin/products',{category:Category})
    },
    addProducts:(req,res)=>{
        console.log(req.files[0].filename);
        let product = new productModel({
            name:req.body.name,
            category:req.body.category,
            description:req.body.description,
            unit:req.body.unit,
            regularPrice:req.body.Rprice,
            promotionalPrice:req.body.Pprice,
            gst:req.body.gst,
            images:[req.files[0].filename,req.files[1].filename,req.files[2].filename,req.files[3].filename]
        })

        product.save().then((status)=>{
            console.log(status);
        }).catch((err)=>{
            console.log(err.message);
        })
    }
}