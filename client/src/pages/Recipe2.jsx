import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

export default function Recipe() {
  SwiperCore.use([Navigation]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  const recipeId = params.recipeId;
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/recipe/get/${recipeId}`, {
          method: "GET",
        });
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setRecipe(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setLoading(false);
        setError(true);
        console.log(error);
      }
    };
    fetchRecipe();
  }, [recipeId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl ">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl ">Something went wrong!:</p>
      )}
      {recipe && !loading && !error && (
        <div className="min-h-screen bg-gray-100 py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Recipe Header */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="relative w-full h-64 sm:h-96 ">
                <img
                  src={recipe.images[0]}
                  alt={recipe.title}
                  className="w-full h-64 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-95 flex items-center justify-center">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
                    {recipe.title}
                  </h1>
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-6">
                <p className="text-gray-600 text-lg mb-4">
                  {recipe.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Servings</p>
                    <p className="text-lg font-semibold">{recipe.servings}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Cook Time</p>
                    <p className="text-lg font-semibold">
                      {recipe.cookTime} mins
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="text-lg font-semibold">{recipe.difficulty}</p>
                  </div>
                </div>

                {/* Tags and Cuisine */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {recipe.cuisine}
                  </span>
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Ingredients */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Ingredients
                  </h2>
                  <ul className="list-disc list-inside space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-700">
                        {ingredient.amount} {ingredient.unit} {ingredient.name}{" "}
                        {ingredient.notes && (
                          <span className="text-gray-500">
                            ({ingredient.notes})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Instructions
                  </h2>
                  <ol className="list-decimal list-inside space-y-2">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-700">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Additional Images */}
                {recipe.images.length > 1 && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Gallery
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {recipe.images.slice(1).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${recipe.title} ${index + 1}`}
                          className="w-full h-32 sm:h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Ratings */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">Average Rating</p>
                  <p className="text-lg font-semibold">
                    {recipe.averageRating > 0
                      ? `${recipe.averageRating}/5`
                      : "No ratings yet"}
                  </p>
                  <p className="text-sm text-gray-500">
                    ({recipe.totalRatings} reviews)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
