import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  //compare id returned form verifyUser.js(req.user.id) to the id in params
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own profile"));
  try {
    // Only process fields that are provided
    const updateFields = {};

    if (req.body.username) updateFields.username = req.body.username;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.avatar) updateFields.avatar = req.body.avatar;

    // Handle password separately for hashing
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(
          errorHandler(400, "Password must be at least 6 characters long")
        );
      }
      updateFields.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Only proceed if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      return next(errorHandler(400, "No valid update fields provided"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      // $set ignores empty fields
      { $set: updateFields },
      { new: true } //returns updated user object
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Seperate password from the rest of data and send rest
    // as json response
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return next(errorHandler(400, "Username or email already exists"));
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  // req.user.id comes from verifyUser JWT
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own profile"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("Your profile has been deleted");
  } catch (error) {
    next(error);
  }
};
