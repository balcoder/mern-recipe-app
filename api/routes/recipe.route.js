import express from "express";
import {
  createRecipe,
  deleteRecipe,
  updateRecipe,
  getRecipe,
} from "../controllers/recipe.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
// base route is '/api/recipe' in index.js
router.post("/create", verifyToken, createRecipe);
router.delete("/delete/:id", verifyToken, deleteRecipe);
router.post("/update/:id", verifyToken, updateRecipe);
router.get("/get/:id", getRecipe);

export default router;
