import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';

mongoose.connect(process.env.MONGO_URI)
   .then(() => {
      console.log('Connected to MongoDB');
   })
   .catch((err) => {
      console.log(err);
   });


const app = express();
const port = 3000;

 app.use("/api/user", userRouter);

 app.listen(port, ()=> {
    console.log(`Express Server running on port ${port}!!!`);
 });