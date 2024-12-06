import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function fetchRecipes() {
      const response = await fetch("/recipes/");
      const data = await response.json();
      setRecipes(data);
    }
    fetchRecipes();
  }, []);

  async function deleteRecipe(recipeId) {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      const response = await fetch(`/recipes/delete/${recipeId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Recipe deleted successfully!");
        setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
      } else {
        alert("Failed to delete recipe.");
      }
    }
  }

  return (
    <div>
      <h2>Your Recipes</h2>
      {recipes.length === 0 ? (
        <p style={{ color: "#646cff", textAlign: "center" }}>
          No recipes to display. Start adding some!
        </p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <h3>{recipe.title}</h3>
              <p>{recipe.ingredients}</p>
              <p>{recipe.instructions}</p>
              <button
                className="delete-btn"
                onClick={() => deleteRecipe(recipe.id)}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecipeList;