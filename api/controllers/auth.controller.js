import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
export const signup = async (req, res, next) => {
    const {username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});    
    // catch any errors while trying to create user like dublicate email etc.
    try {
        // save new user to the database
        await newUser.save();
        res.status(201).json("User created successfully");  

    } catch (error) {
        next(error);
    }   
    
}