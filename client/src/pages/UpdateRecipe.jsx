import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { ref } from "firebase/storage";
import { app } from "../firebase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const defaultIngredient = { name: "", amount: "", unit: "", notes: "" };

const UpdateRecipe = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    servings: 1,
    cookTime: 0,
    difficulty: "Medium",
    ingredients: [{ ...defaultIngredient }],
    instructions: [""],
    category: "",
    cuisine: "",
    tags: [""],
    images: [],
    createdBy: currentUser,
  });

  const [fileList, setFileList] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDataError, setUploadDataError] = useState(false);
  const [loading, setLoading] = useState(false);

  // load data from param recipe id
  // need to call asyn fn inside useEffect for async behaviour
  useEffect(() => {
    const fetchRecipe = async () => {
      const recipeId = params.recipeId;
      const res = await fetch(`/api/recipe/get/${recipeId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
      }
      setForm(data);
    };

    fetchRecipe();
  }, []);

  const handleChange = (e) => {
    console.log(defaultIngredient);
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateArrayField = (field, index, value, subfield = null) => {
    const updated = [...form[field]];

    // if subfield provided assume array contains object otherwise string
    // ingredients = [{},{},..], instructions = ["","",...]
    if (subfield) {
      updated[index][subfield] = value;
    } else {
      updated[index] = value;
    }
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  const addField = (field, defaultValue) => {
    setForm((prev) => {
      // Determine whether to spread the defaultValue or use it directly
      // This checks if defaultValue is a plain object (not null and not an array)
      const newValue =
        typeof defaultValue === "object" &&
        defaultValue !== null &&
        !Array.isArray(defaultValue)
          ? { ...defaultValue } // Create a shallow copy for objects
          : defaultValue; // Use the value directly for primitives (strings, numbers, etc.)

      return {
        ...prev,
        [field]: [...prev[field], newValue],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipeId = params.recipeId;
    try {
      // make sure we have an image
      if (form.images.length < 1)
        return setUploadDataError("You must have a least one image");
      setLoading(true);
      setUploadDataError(false);
      const res = await fetch(`/api/recipe/update/${recipeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        createdBy: currentUser._id,
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setUploadDataError(data.message);
      }
      navigate(`/recipe/${data._id}`);
    } catch (error) {
      setUploadDataError(error.message);
      setUploading(false);
    }
  };
  const handleImageSubmit = () => {
    if (fileList.length > 0 && fileList.length + form.images.length < 4) {
      setUploading(true);
      setUploadDataError(false);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < fileList.length; i++) {
        promises.push(storeImage(fileList[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setForm((prev) => ({
            ...prev,
            images: form.images.concat(urls),
          }));
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2mb max per image)");
        });
    } else {
      setImageUploadError("You can only upload 3 images per Recipe");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i != index),
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
        Update a Recipe
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

        <div className="flex flex-wrap gap-2">
          <label className="w-full text-sm font-medium text-gray-700 mb-2">
            Images: The first image will be the cover (max 3)
          </label>
          <input
            onChange={(e) => {
              setFileList(e.target.files);
            }}
            className="flex-1 p-3 border rounded-lg border-green-700"
            type="file"
            id="images"
            accept="image/*"
            multiple
          />
          <button
            type="button"
            disabled={uploading}
            onClick={handleImageSubmit}
            className="flex-shrink p-3 text-green-700 border rounded uppercase hover:shadow-lg disabled:opacity-80"
          >
            {uploading ? "Uploading.." : "Upload"}
          </button>
          <p className="flex-1 text-red-700">
            {imageUploadError && imageUploadError}
          </p>
        </div>
        {form.images.length > 0 &&
          form.images.map((url, idx) => (
            <div
              key={url}
              className="flex justify-between p-3 border items-center"
            >
              <img
                src={url}
                alt="recipe"
                className="w-40 h-40 object-contain rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(idx)}
                type="button"
                className=" text-red-700 font-semibold p-3 rounded-lg hover:opacity-70"
              >
                Delete
              </button>
            </div>
          ))}

        {/* Submit */}
        {uploadDataError && (
          <p className="text-sm text-red-700">{uploadDataError}</p>
        )}
        <button
          disabled={loading || uploading}
          type="submit"
          className="bg-slate-700 text-white px-6 py-3 rounded-lg shadow hover:opacity-95 transition"
        >
          {loading ? "Updating..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
};

export default UpdateRecipe;
