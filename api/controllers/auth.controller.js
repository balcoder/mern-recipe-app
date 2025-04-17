import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
export const signup = async (req, res) => {
    const {username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});    
    // catch any errors while trying to create user like dublicate email etc.
    try {
        // save new user to the database
        await newUser.save();
    } catch (error) {
        res.status(500).json(error.message);
    }
    // save to the database
    await newUser.save();
    res.status(201).json("User created successfully");    
}