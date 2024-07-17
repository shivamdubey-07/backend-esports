import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


const uploadOnCloudinary = async (localFilePath) => {
  try {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

    console.log('API Key is:', process.env.CLOUDINARY_API_KEY);
    console.log('Cloud Name is:', process.env.CLOUDINARY_NAME);
    console.log('API Secret is:', process.env.CLOUDINARY_API_SECRET);
    
    if (!localFilePath) {
      console.log('Local file path is not provided');
      return null;
    }
    
    console.log('Local file path:', localFilePath);

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    });

 
    
   
    fs.unlinkSync(localFilePath);

    return uploadResult;

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);

    if (localFilePath && fs.existsSync(localFilePath)) {
     
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
