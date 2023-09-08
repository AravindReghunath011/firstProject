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
            console.error('Error while cropping the image:', err);
            // Handle the error as needed
          } else {
            // Save the processed image back to the same file path
            fs.writeFile(inputFilePath, processedImageBuffer, (writeErr) => {
              if (writeErr) {
                console.error('Error while saving the processed image:', writeErr);
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