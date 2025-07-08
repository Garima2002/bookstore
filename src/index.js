import express from 'express'
// import "dotenv/config"
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';
import job from './lib/cron.js';
const app=express()
const PORT= process.env.PORT

app.use(cors());
app.use(express.json());  //parse json request bodies

// job.start()
app.use("/api/auth",authRoutes)
app.use("/api/books",bookRoutes)

app.listen(PORT,()=>{
 console.log(`Server is runninng ${PORT}`)
 connectDB();
})