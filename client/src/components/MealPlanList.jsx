import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

function MealPlanList() {
  const [mealPlans, setMealPlans] = useState([]);

  useEffect(() => {
    async function fetchMealPlans() {
      const response = await fetch("/meal_plans/");
      const data = await response.json();
      setMealPlans(data);
    }
    fetchMealPlans();
  }, []);

  async function deleteMealPlan(mealPlanId) {
    if (window.confirm("Are you sure you want to delete this meal plan?")) {
      const response = await fetch(`/meal_plans/delete/${mealPlanId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Meal plan deleted successfully!");
        setMealPlans((prev) => prev.filter((plan) => plan.id !== mealPlanId));
      } else {
        alert("Failed to delete meal plan.");
      }
    }
  }

  return (
    <div>
      <h2>Your Meal Plans</h2>
      {mealPlans.length === 0 ? (
        <p style={{ color: "#646cff", textAlign: "center" }}>
          No meal plans to display. Create your first one!
        </p>
      ) : (
        <ul>
          {mealPlans.map((plan) => (
            <li key={plan.id}>
              <strong>{plan.week_start}:</strong>{" "}
              {plan.recipes.map((r) => r.title).join(", ")}
              <button
                className="delete-btn"
                onClick={() => deleteMealPlan(plan.id)}
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

export default MealPlanList;