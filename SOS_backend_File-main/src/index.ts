import express from 'express'
import dotenv from 'dotenv'
import fileUploadRouter from './routes/fileUpload';
import { supabase } from './config/supabase';
import requestsRouter from './routes/requests';
const app = express();
import cookieParser from "cookie-parser";
import cors from 'cors'
import authRouter from './routes/auth';
import locationRouter from './routes/locationsRouter';
import { Request, Response } from 'express';
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // Allows all origins
    },
    credentials: true, // Required for cookies
  })
);
app.use(cookieParser())
dotenv.config();
app.use(express.json());

// app.use(exp)
app.use(fileUploadRouter);
app.use(requestsRouter);
app.use(authRouter)
app.use(locationRouter)
const PORT = 5000;
const createUser = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: "bhoumikchopra12@gmail.com",
      password: "Tiger@80804",
    });
    if(error){
      console.error("Error signing up:", error.message);
      return;
    }
    const { data:handlerData ,error:InsertError}= await supabase.from("request_handlers").insert({
      id: data?.user?.id,
      email: data?.user?.email,
      station_type:"fire",
      
    })
    if (InsertError) {
      console.error("Error signing up:", InsertError.message);
      return;
    }
  
    console.log("User signed up:", data);
  };
// createUser();
app.get('/',(req:Request,res:Response)=>{
  res.send("jjjsjjsjjsjjs");
})
app.listen(PORT,"0.0.0.0", ()=>{
    console.log("Working at port ", PORT);
})
