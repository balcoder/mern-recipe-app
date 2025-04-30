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
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2016/11/08/15/21/user-1808597_640.png"
    },
},{ timestamps: true });

// create the model with the schema

const User = mongoose.model('User', userSchema);

export default User;