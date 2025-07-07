import { useState } from "react";

const defaultIngredient = { name: "", amount: "", unit: "", notes: "" };

const CreateRecipe = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    servings: 1,
    cookTime: 0,
    difficulty: "Medium",
    ingredients: [defaultIngredient],
    instructions: [""],
    category: "",
    cuisine: "",
    tags: [""],
    images: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateArrayField = (field, index, value, subfield = null) => {
    const updated = [...form[field]];
    // if subfield provided assume array contains object otherwise string
    // ingredients = [{},{},..], instructions = ["","",...], images = ["","",...]
    if (subfield) {
      updated[index][subfield] = value;
    } else {
      updated[index] = value;
    }
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  const addField = (field, defaultValue) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // submit logic goes here
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
        Create a New Recipe
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title, Description */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Servings
            </label>
            <input
              type="number"
              name="servings"
              value={form.servings}
              onChange={handleChange}
              min={1}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cook Time (mins)
            </label>
            <input
              type="number"
              name="cookTime"
              value={form.cookTime}
              onChange={handleChange}
              min={0}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients
          </label>
          {form.ingredients.map((ing, idx) => (
            <div key={idx} className="grid gap-2 md:grid-cols-4 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={ing.name}
                onChange={(e) =>
                  updateArrayField("ingredients", idx, e.target.value, "name")
                }
                className="px-3 py-2 border rounded-lg focus:outline-none"
              />
              <input
                type="number"
                placeholder="Amount"
                min="0"
                value={ing.amount}
                onChange={(e) =>
                  updateArrayField("ingredients", idx, e.target.value, "amount")
                }
                className="px-3 py-2 border rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Unit"
                value={ing.unit}
                onChange={(e) =>
                  updateArrayField("ingredients", idx, e.target.value, "unit")
                }
                className="px-3 py-2 border rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Notes"
                value={ing.notes}
                onChange={(e) =>
                  updateArrayField("ingredients", idx, e.target.value, "notes")
                }
                className="px-3 py-2 border rounded-lg focus:outline-none"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("ingredients", defaultIngredient)}
            className="text-blue-700 text-sm font-medium hover:underline mt-1"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions
          </label>
          {form.instructions.map((step, idx) => (
            <textarea
              key={idx}
              rows="2"
              placeholder={`Step ${idx + 1}`}
              value={step}
              onChange={(e) =>
                updateArrayField("instructions", idx, e.target.value)
              }
              className="w-full mb-2 px-3 py-2 border rounded-lg focus:outline-none"
            />
          ))}
          <button
            type="button"
            onClick={() => addField("instructions", "")}
            className="text-blue-700 text-sm font-medium hover:underline"
          >
            + Add Step
          </button>
        </div>

        {/* Category, Cuisine, Tags */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select</option>
              {[
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
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cuisine
            </label>
            <select
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select</option>
              {[
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
              ].map((cui) => (
                <option key={cui} value={cui}>
                  {cui}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={form.tags.join(", ")}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim().toLowerCase()),
                }))
              }
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Image URLs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URLs
          </label>
          {form.images.map((img, idx) => (
            <input
              key={idx}
              type="url"
              placeholder="https://example.com/image.jpg"
              value={img}
              onChange={(e) => updateArrayField("images", idx, e.target.value)}
              className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none"
            />
          ))}
          <button
            type="button"
            onClick={() => addField("images", "")}
            className="text-blue-700 text-sm font-medium hover:underline"
          >
            + Add Image URL
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-slate-700 text-white px-6 py-3 rounded-lg shadow hover:opacity-95 transition"
        >
          Submit Recipe
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
