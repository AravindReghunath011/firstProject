const productModel = require('../models/productModel');
const productMulter = require('../multer/productMulter');
const categoryModel = require('../models/categoryModel');


module.exports={
    getAddproduct:async(req,res)=>{
        let Category = await categoryModel.find({}).lean()
        res.render('admin/products',{category:Category})
    },
    addProducts:async(req,res)=>{
        try {
            let category = await categoryModel.findOne({name:req.body.category})
        let product = new productModel({
            name:req.body.name,
            category:category._id,
            description:req.body.description,
            unit:req.body.unit,
            regularPrice:req.body.Rprice,
            promotionalPrice:req.body.Pprice,
            gst:req.body.gst,
            images:[req.files[0].filename,req.files[1].filename,req.files[2].filename,req.files[3].filename]
        })

        product.save().then((status)=>{
            console.log(status);
            res.redirect('/admin/products')
        }).catch((err)=>{
            console.log('adich poi gooys',err.message);
            
            res.redirect('/admin/products')
        })

            
        } catch (error) {
            console.log(error.message);
        }
        
    },
    showProducts:async(req,res)=>{
        let products = await productModel.find({}).lean()
        console.log('products',products);
        res.render('users/showProducts',{products})
    },
    adminProductList:async(req,res)=>{
        let product = await productModel.find({}).lean()
        res.render('admin/admin-productList',{product})
    },
    productDetails:async(req,res)=>{
        try {
            let product = await productModel.findById(req.query.id)
        res.render('users/productDetail',{product})
            
        } catch (error) {
            console.log(error.message);
        }
    },
    deleteProduct:async(req,res)=>{
        await productModel.deleteOne({_id:req.query.id})
        res.redirect('/admin/productList')
    },
    getEditProduct:async(req,res)=>{
        let product = await productModel.findOne({_id:req.query.id}).lean()
        let category = await categoryModel.find({}).lean()
        console.log(product);
        res.render('admin/edit-product',{category,product})
    },
    editProduct:async(req,res)=>{
        console.log(req.files);
        if(req.files.length !== 0){
            console.log(req.query.id);
            console.log('Entered');
            let id = req.query.id
            let product = await productModel.findByIdAndUpdate(id,
                {name:req.body.name,
                    category:req.body.category,
                    description:req.body.description,
                    promotionalPrice:req.body.Pprice,
                    gst:req.body.gst,
                    unit:req.body.unit,
                    regularPrice:req.body.Rprice,
                images:[req.files[0].filename,req.files[1].filename,req.files[2].filename,req.files[3].filename]
            },{new:true})
            console.log('product',product);
            if(product){
                console.log('if workedd');
                res.redirect('/admin/productList')
            }else{
                console.log('fuck updated');
                res.redirect('/admin/productList')
            }

        }else{
            let id = req.query.id
            console.log(id,'id');

            let product = await productModel.findByIdAndUpdate(id,
                {name:req.body.name,
                category:req.body.category,
                description:req.body.description,
                promotionalPrice:req.body.Pprice,
                gst:req.body.gst,
                unit:req.body.unit,
                regularPrice:req.body.Rprice
    
            },{new:true})
            if(product){
                
               console.log('else worked');
               console.log(product);
                res.redirect('/admin/productList')
            }else{
                console.log('not updated');
                res.redirect('/admin/productList')
            }
        }
        console.log(req.query.id);
        
        let id = req.query.id
       
       
        

    }
}