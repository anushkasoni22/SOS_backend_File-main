import axios from "axios";
import { Request,Response } from "express"
export const getLocationFromGoogle=async(req:Request, res:Response):Promise<void>=>{
    const {longitude, latitude}=req.body;
    try{
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAKh-gY2tdwjmGO6XnUsqyDR-h8_ICk4tU`,
            {
              headers: {
                withCredentials: true,
              },
            }
        );
        
        res.status(200).json({msg:response.data});
    }catch(e){
        res.status(500).json({error:"API error occured"})
    }
}