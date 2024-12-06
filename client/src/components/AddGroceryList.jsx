import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

function AddGroceryList() {
  const [items, setItems] = useState("");
  const [groceryLists, setGroceryLists] = useState({});
  const [listName, setListName] = useState("");

  useEffect(() => {
    async function fetchGroceryLists() {
      try {
        const response = await fetch("/grocery_list/");
        if (response.ok) {
          const data = await response.json();

          // Validate and set grocery lists
          if (data.items) {
            const formattedLists = data.items.reduce((acc, list) => {
              acc[list.name] = Array.isArray(list.items) ? list.items : [];
              return acc;
            }, {});
            setGroceryLists(formattedLists);
          } else {
            console.error("Unexpected response format:", data);
            setGroceryLists({});
          }
        } else {
          console.error("Failed to fetch grocery lists. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching grocery lists:", error);
      }
    }
    fetchGroceryLists();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const itemArray = items.split(",").map((item) => item.trim());

    try {
      const response = await fetch("/grocery_list/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: listName, items: itemArray }),
      });

      if (response.ok) {
        const newGroceryList = await response.json();
        setGroceryLists((prev) => ({
          ...prev,
          [newGroceryList.name]: newGroceryList.items,
        }));
        setItems("");
        setListName("");
        alert("Grocery list added successfully!");
      } else {
        const errorText = await response.text();
        console.error("Failed to add grocery list. Response:", errorText);
        alert("Failed to add grocery list.");
      }
    } catch (error) {
      console.error("Error adding grocery list:", error);
    }
  }

  async function deleteGroceryList(groceryListName) {
    if (window.confirm("Are you sure you want to delete this grocery list?")) {
      const response = await fetch(`/grocery_list/delete/${groceryListName}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Grocery list deleted successfully!");
        setGroceryLists((prev) => {
          const updatedLists = { ...prev };
          delete updatedLists[groceryListName];
          return updatedLists;
        });
      } else {
        alert("Failed to delete grocery list.");
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add Grocery List</h2>
        <label>
          List Name:
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            required
          />
        </label>
        <label>
          Items (comma-separated):
          <input
            type="text"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder="e.g., Milk, Eggs, Bread"
            required
          />
        </label>
        <button type="submit">Add Grocery List</button>
      </form>

      <h3>Existing Grocery Lists</h3>
      {Object.keys(groceryLists).length > 0 ? (
        <ul>
          {Object.entries(groceryLists).map(([listName, listItems]) => (
            <li key={listName}>
              <strong>{listName}</strong>: {Array.isArray(listItems) ? listItems.join(", ") : "No items"}
              <button
                className="delete-btn"
                onClick={() => deleteGroceryList(listName)}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No grocery lists available.</p>
      )}
    </div>
  );
}

export default AddGroceryList;