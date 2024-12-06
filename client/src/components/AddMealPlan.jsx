import { useState, useEffect } from "react";

function AddMealPlan() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [weekStart, setWeekStart] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch("/recipes/");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          alert("Failed to fetch recipes.");
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
    fetchRecipes();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("/meal_plans/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week_start: weekStart, recipes: selectedRecipes }),
      });

      if (response.ok) {
        alert("Meal plan added successfully!");
        setWeekStart("");
        setSelectedRecipes([]);
      } else {
        alert("Failed to add meal plan.");
      }
    } catch (error) {
      alert("An error occurred.");
    }
  }

  function handleRecipeChange(e) {
    const recipeId = parseInt(e.target.value, 10);
    setSelectedRecipes((prev) =>
      e.target.checked ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Meal Plan</h2>
      <label>
        Date:
        <input
          type="date"
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
        />
      </label>
      <h3>Select Recipes:</h3>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item">
            <input
              type="checkbox"
              value={recipe.id}
              onChange={handleRecipeChange}
              id={`recipe-${recipe.id}`}
            />
            <label htmlFor={`recipe-${recipe.id}`}>{recipe.title}</label>
          </div>
        ))}
      </div>
      <button type="submit">Add Meal Plan</button>
    </form>
  );
}

export default AddMealPlan;