import express from 'express'
import { getLocationFromGoogle } from '../controllers/locationController';
const locationRouter=express.Router();
locationRouter.post('/getGeoLocation',getLocationFromGoogle);
  
export default locationRouter;