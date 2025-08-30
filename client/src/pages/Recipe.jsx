import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Users, ChefHat, Star, Calendar, Tag } from "lucide-react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

export default function Recipe() {
  SwiperCore.use([Navigation]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const recipeData = recipe;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === recipeData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? recipeData.images.length - 1 : prev - 1
    );
  };

  return (
    <main className="my-6">
      {loading && <p className="text-center my-7 text-2xl">Loading....</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {recipe && !loading && !error && (
        <div className="max-w-5xl lg:mx-auto mx-2 p-6 bg-white rounded-2xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {recipeData.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {recipeData.description}
            </p>

            {/* Recipe Meta Info */}
            <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(recipeData.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>
                  {recipeData.averageRating}/5 ({recipeData.totalRatings}{" "}
                  reviews)
                </span>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Cook Time</div>
                <div className="text-lg font-semibold">
                  {recipeData.cookTime} mins
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Servings</div>
                <div className="text-lg font-semibold">
                  {recipeData.servings}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <ChefHat className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Difficulty</div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    recipeData.difficulty
                  )}`}
                >
                  {recipeData.difficulty}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Tag className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Category</div>
                <div className="text-lg font-semibold">
                  {recipeData.category}
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {recipeData.images && recipeData.images.length > 0 && (
            <div className="mb-8">
              <div className="relative">
                <img
                  src={recipeData.images[currentImageIndex]}
                  alt={`${recipeData.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />

                {recipeData.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Image indicators */}
              {recipeData.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {recipeData.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ingredients Section */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ingredients
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-3">
                  {recipeData.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-3">•</span>
                      <div>
                        <span className="font-medium">
                          {ingredient.amount} {ingredient.unit}{" "}
                          {ingredient.name}
                        </span>
                        {ingredient.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            {ingredient.notes}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Instructions
              </h2>
              <div className="space-y-4">
                {recipeData.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 leading-relaxed pt-1">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tags and Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <span className="text-sm font-medium text-gray-700 mr-2">
                  Cuisine:
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {recipeData.cuisine}
                </span>
              </div>

              {recipeData.tags && recipeData.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Tags:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recipeData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
