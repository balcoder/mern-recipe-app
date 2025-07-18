import { useSelector } from "react-redux";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showRecipesError, setShowRecipesError] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const dispatch = useDispatch();

  // firebase storage rules
  // allow read;
  // allow write: if request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*');

  const handleFileUpload = useCallback(
    (file) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      // use uploadBytesResumable to see the progress of the upload
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        },
        (error) => {
          console.log(error);
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downLoadURL) => {
            // setFormData({ ...formData, avatar: downLoadURL });
            // Use functional update instead of spreading formData to
            // stop infinite loop
            setFormData((prevFormData) => ({
              ...prevFormData,
              avatar: downLoadURL,
            }));
          });
        }
      );
    },
    // [formData]
    []
  );

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file, handleFileUpload]);

  const handleChange = (e) => {
    // change formData based on id of the input tag
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      // dispatch the error using reducer redux/user/userSlice.js
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async (req, res, next) => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error));
      next(error);
    }
  };
  const handleShowRecipes = async () => {
    try {
      setShowRecipesError(false);
      const res = await fetch(`/api/user/recipes//${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowRecipesError(true);
        return;
      }
      setUserRecipes(data);
    } catch (error) {
      setShowRecipesError(error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const res = await fetch(`/api/recipe/delete/${recipeId}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      // update the recipe listings
      setUserRecipes((prev) =>
        prev.filter((recipe) => recipe._id !== recipeId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error uploading Image(image must be less than 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-green-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          autoComplete="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          autoComplete="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          autoComplete="current-password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white rounded-lg p-3 uppercase text-center hover:opacity-90 "
          to={"/create-recipe"}
        >
          Create Recipe
        </Link>
      </form>
      <div className="flex justify-between mt-4">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User profile updated successfully" : ""}
      </p>
      <button onClick={handleShowRecipes} className="text-green-700 w-full">
        Show Recipes
      </button>
      <p className="text-red-700 mt-5">
        {showRecipesError ? "Error showing recipes" : ""}
      </p>
      <div></div>
      {userRecipes && userRecipes.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Recipes
          </h1>
          {userRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="border rounded-lg p-3 flex justify-between gap-5 items-center"
            >
              <Link className="" to={`/recipe/${recipe._id}`}>
                <img
                  className="w-20 h-20 object-contain"
                  src={recipe.images[0]}
                />
              </Link>
              <Link
                className="font-semibold flex-1 hover:underline truncate text-slate-700"
                to={`/recipe/${recipe._id}`}
              >
                {recipe.title}
              </Link>
              <div className="flex flex-col gap-2 items-center">
                <button
                  onClick={() => handleDeleteRecipe(recipe._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-recipe/${recipe._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
