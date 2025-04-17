import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

mongoose.connect(process.env.MONGO_URI)
   .then(() => {
      console.log('Connected to MongoDB');
   })
   .catch((err) => {
      console.log(err);
   });


const app = express();

// allow server to accept json
app.use(express.json());
const port = 3000;

 app.use("/api/user", userRouter);
 app.use('/api/auth', authRouter);

 app.listen(port, ()=> {
    console.log(`Express Server running on port ${port}!!!`);
 });