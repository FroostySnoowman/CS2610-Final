import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

function GroceryList() {
  const [groceryList, setGroceryList] = useState([]);

  useEffect(() => {
    async function fetchGroceryList() {
      try {
        const response = await fetch("/grocery_list/");
        if (response.ok) {
          const data = await response.json();
          setGroceryList(data.items || []);
        } else {
          console.error("Failed to fetch grocery list.");
        }
      } catch (error) {
        console.error("Error fetching grocery list:", error);
      }
    }
    fetchGroceryList();
  }, []);

  async function deleteGroceryList(groceryListId) {
    if (window.confirm("Are you sure you want to delete this grocery list?")) {
      try {
        const response = await fetch(`/grocery_list/delete/${groceryListId}/`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Grocery list deleted successfully!");
          setGroceryList((prev) =>
            prev.filter((list) => list.id !== groceryListId)
          );
        } else {
          console.error("Failed to delete grocery list.");
        }
      } catch (error) {
        console.error("Error deleting grocery list:", error);
      }
    }
  }

  return (
    <div>
      <h2>Your Grocery Lists</h2>
      {groceryList.length === 0 ? (
        <p style={{ color: "#646cff", textAlign: "center" }}>
          No grocery lists to display. Start creating your first one!
        </p>
      ) : (
        <ul>
          {groceryList.map((list) => (
            <li key={list.id}>
              <strong>{list.name}</strong>: {list.items.join(", ")}
              <button
                className="delete-btn"
                onClick={() => deleteGroceryList(list.id)}
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

export default GroceryList;