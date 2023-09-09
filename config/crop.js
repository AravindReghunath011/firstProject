const sharp = require('sharp')
const fs = require('fs')

module.exports={
    bannerCrop:(req,res,next)=>{
        console.log(req.file,'ggggg');
      const inputFilePath = req.file.path;
      
        
      // Use sharp to read the input image
      sharp(inputFilePath) 
        .resize(1600,800)
        .toFormat('webp')
        .toBuffer((err, processedImageBuffer) => {
          if (err) {
            req.session.bannerCropErr  = 'Use any other image format'
            res.redirect('/admin/banner')
          } else {
            // Save the processed image back to the same file path
            fs.writeFile(inputFilePath, processedImageBuffer, (writeErr) => {
              if (writeErr) {
                req.session.bannerCropErr  = 'Use any other image format'
                res.redirect('/admin/banner')
                // Handle the error as needed
              } else {
                console.log('Image cropped and saved successfully to:', inputFilePath);
                // Handle success or return a response as needed
                next()
              }
            });
          }
        });
      
    }
}