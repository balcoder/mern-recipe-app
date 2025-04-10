import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI)
   .then(() => {
      console.log('Connected to MongoDB')
   })
   .catch((err) => {
      console.log(err);
   })


const app = express()
const port = 3000

 app.get('/', (req, res) => {
    res.send('Hello World!')
 })

 app.listen(port, ()=> {
    console.log(`Express Server running on port ${port}!!!`)
 })