import axios from "axios";
import { Request,Response } from "express"
export const getLocationFromGoogle=async(req:Request, res:Response):Promise<void>=>{
    const {longitude, latitude}=req.body;
    try{
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=PUT YOUR KEY HERE`,
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
