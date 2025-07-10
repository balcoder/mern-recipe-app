import Recipe from "../models/recipe.model.js";
import { errorHandler } from "../utils/error.js";

export const createRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.create(req.body);
    return res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  // check if recipe exists
  if (!recipe) return next(errorHandler(404, "Recipe not found"));
  // check if recipe belongs to user
  if (req.user.id !== recipe.createdBy.toString()) {
    return next(errorHandler(401, "You can only delete your own recipes"));
  }
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    return res.status(200).json(`Recipe id:${req.params.id} has been deleted`);
  } catch (error) {
    next(error);
  }
};
