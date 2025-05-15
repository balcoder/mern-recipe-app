import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

// connect to mogodb database
mongoose.connect(process.env.MONGO_URI)
   .then(() => {
      console.log('Connected to MongoDB');
   })
   .catch((err) => {
      console.log(err);
   });

// create the express app and set port varaible
const app = express();
const port = 3000;

// allow server to accept json
app.use(express.json());

app.use(cookieParser());


 app.use("/api/user", userRouter);
 app.use('/api/auth', authRouter);

// middleware for handling errors
app.use((err, req, res, next) => {
   const statusCode = err.statusCode || 500;
   const message = err.message || 'Internal Server Error';   
   return res.status(statusCode).json({
      success: false,
      statusCode,
      message
   })
 });

 app.listen(port, ()=> {
    console.log(`Express Server running on port ${port}!!!`);
 });