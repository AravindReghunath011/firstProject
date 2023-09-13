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
            images:[req.files[0].filename,req.files[1].filename,req.files[2].filename,req.files[3].filename]
        })

        product.save().then((status)=>{
           
            res.redirect('/admin/products')
        }).catch((err)=>{  
            console.log(err.message);
            
            res.redirect('/admin/products')
        })

            
        } catch (error) {
            console.log(error.message);
        }
        
    },
    showProducts:async(req,res)=>{
        
        
        var products = await productModel.aggregate([
            
            {$project:{
                name:1,
                description:1,
                unit:1,
                regularPrice:1,
                promotionalPrice:1,
                category:1,
                images:1,
                catId:{'$toObjectId':'$category'},
                
            }},
            {$lookup:{
                from:'categories', 
                localField:'catId', 
                foreignField:'_id',
                as:'categoryDetails',
            }},{
            $match:{
                'categoryDetails.isListed':1
            }}
        ])

        let category = await categoryModel.find()

        console.log(products,'kkkkkkkkkkkkkkkkkkk');
        res.render('users/showProducts',{products,isLoggedIn:req.session.isLoggedIn,category})
    },
    adminProductList:async(req,res)=>{
        let product = await productModel.find({}).lean()
        res.render('admin/admin-productList',{product})
    },
    productDetails:async(req,res)=>{
        try {
            let product = await productModel.findById(req.query.id)
        res.render('users/productDetail',{product,isLoggedIn : req.session.isLoggedIn})
            
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
        let category = await categoryModel.findOne({name:req.body.category})
        if(req.files.length !== 0){
            console.log(req.query.id);
            console.log('Entered');
            let id = req.query.id
            let product = await productModel.findByIdAndUpdate(id,
                {name:req.body.name,
                    category:category._id,
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
                console.log(' updated');
                res.redirect('/admin/productList')
            }

        }else{
            let id = req.query.id
            console.log(id,'id');

            let product = await productModel.findByIdAndUpdate(id,
                {name:req.body.name,
                category:category._id,
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
        
        

    },
    searchProd:async(req,res)=>{
       
        let products = await productModel.find({
            name: { $regex: `${req.body.search}`, $options: 'i' }
        });
        console.log(products);
        res.render('users/showProducts',{products,isLoggedIn:req.session.isLoggedIn})
    }
    
    
}