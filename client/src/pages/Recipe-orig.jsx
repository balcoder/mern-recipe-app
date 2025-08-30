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
        <>
          <div className="flex">
            <div className="flex-1">
              {recipe.images && recipe.images.length > 0 && (
                <img src={recipe.images[0]} alt={recipe.title} />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-center my-7 text-2xl">{recipe.title}</h1>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
