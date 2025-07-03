import mongoose from "mongoose";

// Sub-schema for ingredients
const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// Sub-schema for ratings
const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Main Recipe Schema
const recipeSchema = new mongoose.Schema({
  // Core Recipe Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  servings: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  cookTime: {
    type: Number,
    required: true,
    min: 0, // in minutes
  },

  // Ingredients and Instructions
  ingredients: {
    type: [ingredientSchema],
    required: true,
    validate: {
      validator: function (ingredients) {
        return ingredients && ingredients.length > 0;
      },
      message: "Recipe must have at least one ingredient",
    },
  },
  instructions: {
    type: [String],
    required: true,
    validate: {
      validator: function (instructions) {
        return instructions && instructions.length > 0;
      },
      message: "Recipe must have at least one instruction",
    },
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },

  // Categorization
  category: {
    type: String,
    required: true,
    enum: [
      "Breakfast",
      "Lunch",
      "Dinner",
      "Appetizer",
      "Dessert",
      "Snack",
      "Beverage",
      "Soup",
      "Salad",
      "Side Dish",
      "Main Course",
    ],
  },
  cuisine: {
    type: String,
    enum: [
      "American",
      "Italian",
      "Mexican",
      "Asian",
      "Chinese",
      "Japanese",
      "Indian",
      "French",
      "Mediterranean",
      "Thai",
      "Greek",
      "Spanish",
      "Middle Eastern",
      "Other",
    ],
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],

  // Media and Presentation
  images: [
    {
      type: String,
      validate: {
        validator: function (url) {
          return /^https?:\/\/.+/.test(url);
        },
        message: "Image must be a valid URL",
      },
    },
  ],

  // User Interaction
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ratings: [ratingSchema],
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to calculate average rating
recipeSchema.pre("save", function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
    this.totalRatings = this.ratings.length;
  }
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
recipeSchema.index({ title: "text", description: "text" });
recipeSchema.index({ category: 1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ createdBy: 1 });
recipeSchema.index({ averageRating: -1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ tags: 1 });

// Virtual for URL-friendly slug
recipeSchema.virtual("slug").get(function () {
  return this.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-");
});

// Ensure virtual fields are serialized
recipeSchema.set("toJSON", {
  virtuals: true,
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
