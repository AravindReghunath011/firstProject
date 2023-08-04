const User = require('../models/userModel');
const category = require('../models/categoryModel');
const multer = require('multer')
const {Rembg} = require('rembg-node');
const sharp = require('sharp');
const busboy = require('busboy-body-parser')


module.exports={
    getDashboard:(req,res)=>{
        res.render('admin/admin-dashboard')
    },
    getCategory:async(req,res)=>{
      let data = await category.find({})
      console.log(data);
        res.render('admin/categories',{data:data})
    },

    
    addCategory:async(req,res)=>{
        let data = await category.find()
        console.log('add category');
        console.log(req.body);

        (async () => {
            const rembg = new Rembg({
              logging: true,
            });
        
            try {
              // Assuming the uploaded image is stored in 'req.file.path'
              console.log(req.file)
              const input = sharp(req.file.path); 
              const output = await rembg.remove(input);
              await output.webp().toFile('./public/upload/category/'+req.file.filename);
              res.status(200).json({ message: 'Background removed image saved successfully!' });
            } catch (error) {
              res.status(500).json({ error: 'An error occurred while processing the image.' });
            }
          })();

          let newcategory = new category({
            category:req.body.category,
            basePrice:req.body.basePrice,
            description:req.body.description,
            image:req.file.filename,
            
            
        })

        await newcategory.save().then((data)=>{
            console.log("Sucess")
           
        }).catch((err)=>{
            console.log(err.message);
        })

        
        

    }
}