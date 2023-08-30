const User = require('../models/userModel');
const category = require('../models/categoryModel');
const {Rembg} = require('rembg-node');
const sharp = require('sharp');
const categoryModel = require('../models/categoryModel');
const { log } = require('debug/src/node');
const orderModel = require('../models/orderModel');



module.exports={
    getDashboard:(req,res)=>{
        res.render('admin/admin-dashboard')
    },
    getCategory:async(req,res)=>{
      let data = await category.find({})
      console.log(data);
      
        res.render('admin/categories',{data:data,Err:req.session.categoryExist})
        
    },

    
    addCategory:async(req,res)=>{

      let categoryExist = await categoryModel.findOne({
        name: { $regex: new RegExp(req.body.category, 'i') }
    })
    console.log(categoryExist,'kikiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiikkkkkkkk');

    if(categoryExist){
      req.session.categoryExist = true
      res.redirect('/admin/categories')

    }else{


    
      
        console.log(req.file);
        (async () => {
            const rembg = new Rembg({
              logging: true,
            });
        
            try {
              // Assuming the uploaded image is stored in 'req.file.path'
              
              let input = sharp(req.file.path); 
              let output = await rembg.remove(input);
              await output.webp().toFile('./public/upload/category/'+req.file.filename);
              let newcategory = new category({
                name:req.body.category,
                basePrice:req.body.basePrice,
                isListed:1,
                image:req.file.filename,
                
                
            })
    
            await newcategory.save().then((data)=>{
                console.log("Sucess")
               
            }).catch((err)=>{
                console.log(err.message);
            })
              res.redirect('/admin/categories')
              
            } catch (error) {
              
              res.status(500).json({ error: 'An error occurred while processing the image.' });
            }
          })();

         

    }
        

    },
    userCategroyList:async(req,res)=>{
      let categories = await category.find({isListed:1}).lean()
      res.render('users/userCategoryList',{categories,isLoggedIn:req.session.isLoggedIn})
    },
    getEditCategory:async(req,res)=>{
      try{
        let category = await categoryModel.findById(req.query.id)
        
        res.render('admin/editCategory',{category})
      }catch(error){
        console.log(error.message);

      }
    },
    editCategory:async(req,res)=>{
      try{
        let categoryExist = await categoryModel.find({
          category: { $regex: new RegExp(req.body.category, 'i') }
      })
      console.log(categoryExist,'kikikiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiki ');
        if(categoryExist){
          res.redirect('/admin/categories')
        }else{
        console.log(req.query.id);
        console.log(req.file,'req file');
        if(req.file){
          console.log('entered');
        (async () => {
          const rembg = new Rembg({
            logging: true,
          });
      
          try {
            // Assuming the uploaded image is stored in 'req.file.path'
            
            let input = sharp(req.file.path); 
            let output = await rembg.remove(input);
            await output.webp().toFile('./public/upload/category/'+req.file.filename);
            let newcategory = await categoryModel.findByIdAndUpdate(req.query.id,{
              name:req.body.category,
              basePrice:req.body.basePrice, 
              isListed:1,
              image:req.file.filename,
              
              
          },{new:true})
          console.log(newcategory,'=====');
  
         
            
            
          } catch (error) {
            
            res.status(500).json({ error: 'An error occurred while processing the image.' });
          }
        })();
      }else{
        let newcategory = await categoryModel.findByIdAndUpdate(req.query.id,{
          name:req.body.category,
          basePrice:req.body.basePrice,
          isListed:1,
          
          
          
      })
     
      }
      res.redirect('/admin/categories')
       
      }}catch(err){
        console.log(err.message);
      }
    },
    list:async(req,res)=>{
      try{
        console.log(req.query.id);
        var id = req.query.id
        await categoryModel.findByIdAndUpdate(id,{isListed:1})
        res.redirect('/admin/categories')
      }catch(error){
        console.log('err',error.message);
      }
    },
    unlist:async(req,res)=>{
      try{
        console.log(req.query.id);
        let id = req.query.id
        await categoryModel.findByIdAndUpdate(id,{isListed:0})
        res.redirect('/admin/categories')
      }catch(error){
        console.log(error.message);
      }
    },
    searchCategory:async(req,res)=>{
      console.log(req.body.search,'hjkjhj');
      let categories = await categoryModel.find({
        name: { $regex: `^${req.body.search}`, $options: 'i' }
    });
    
    console.log(categories,'dfghjkl');
    

    res.render('users/userCategoryList',{categories,isLoggedIn:req.session.isLoggedIn})
    },
   
}