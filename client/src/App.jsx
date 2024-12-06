import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe";
import MealPlanList from "./components/MealPlanList";
import AddMealPlan from "./components/AddMealPlan";
import GroceryList from "./components/GroceryList";
import AddGroceryList from "./components/AddGroceryList";

function App() {
  return (
    <Router>
      <Header />
      <main>
        <nav>
          <ul>
            <li>
              <Link to="/recipes">View Recipes</Link>
            </li>
            <li>
              <Link to="/recipes/add">Add Recipe</Link>
            </li>
            <li>
              <Link to="/meal_plans">View Meal Plans</Link>
            </li>
            <li>
              <Link to="/meal_plans/add">Add Meal Plan</Link>
            </li>
            <li>
              <Link to="/grocery_list">View Grocery List</Link>
            </li>
            <li>
              <Link to="/grocery_list/add">Add Grocery List</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/add" element={<AddRecipe />} />
          <Route path="/meal_plans" element={<MealPlanList />} />
          <Route path="/meal_plans/add" element={<AddMealPlan />} />
          <Route path="/grocery_list" element={<GroceryList />} />
          <Route path="/grocery_list/add" element={<AddGroceryList />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;