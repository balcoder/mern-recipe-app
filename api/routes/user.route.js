import express from "express";
import {
  deleteUser,
  updateUser,
  getUserRecipes,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

// create a router
const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/recipes/:id", verifyToken, getUserRecipes);

export default router;
