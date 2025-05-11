import { Request, Response } from "express";
import dotenv from "dotenv";
import {
  deleteFromSupabaseUsingUrl,
  predictFireSeverity,
  uploadToSupabase,
} from "../utils/helperFunctions";
import axios from "axios";
import { addIssueToContext } from "zod";

dotenv.config();

// Hugging Face API details

// 🚀 Main function to process and upload files
export const processAndUploadFile = async (req: Request, res: Response) => {
  try {
    // Parse uploaded files
    const files = req.files as { image?: Express.Multer.File[] };
    const imageFile = files?.image?.[0];
    const { requestType } = req.body as { requestType: "fire" | "medical" };
    if (!imageFile) {
      res.status(400).json({ error: "No image uploaded." });
      return;
    }
    console.log("📸 Received image for fire severity classification...");
    const imageUrl = await uploadToSupabase(imageFile, requestType);

    if (!imageUrl) {
      res.status(500).json({ error: "Image upload failed." });
      return;
    }

    const formData = new FormData();
    formData.append("image_url", imageUrl); // or maybe "image", "url", etc.

    if (requestType == "fire") {
      const uploadImageResponse = await axios.post(
        "https://fire-predict-api.onrender.com/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      const prediction = uploadImageResponse.data.prediction;

      // if(uploadImageResponse && uploadImageResponse.data.prediction){
      //   console.log("Prediction Response:", uploadImageResponse.data);
      //   if(prediction['Predicted Class']==='Fake'){
      //     await deleteFromSupabaseUsingUrl(imageUrl);
      //     res.status(400).json({
      //       message: "❌ Fake Image detected",
      //       predictionClassification:prediction['Predicted Class']
      //     });
      //     return;
      //   }
      // }
      
      res.status(200).json({
        message: "✅ File uploaded successfully",
        imageUrl,
        predictionClassification: prediction["Predicted Class"],
      });
    }else{
      const uploadImageResponse = await axios.post(
        "https://yolo-medical-predict.onrender.com/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const prediction = uploadImageResponse.data.prediction;
      // if(uploadImageResponse && uploadImageResponse.data.prediction){
      //   console.log("Prediction Response:", uploadImageResponse.data);
      //   if(prediction['Predicted Class']==='Fake'){
      //     await deleteFromSupabaseUsingUrl(imageUrl);
      //     res.status(400).json({
      //       message: "❌ Fake Image detected",
      //       predictionClassification:prediction['Predicted Class']
      //     });
      //     return;
      //   }
      // }
      
      res.status(200).json({
        message: "✅ File uploaded successfully",
        imageUrl,
        predictionClassification:prediction.length===0?'fake': prediction[0].class,
      });
      console.log('gone')
      
    }
  } catch (error: any) {
    console.error("❌ An error occurred:", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};