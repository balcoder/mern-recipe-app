import mongoose from "mongoose";

// create the schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,        
    }
},{ timestamps: true });

// create the model with the schema

const User = mongoose.model('User', userSchema);

export default User;