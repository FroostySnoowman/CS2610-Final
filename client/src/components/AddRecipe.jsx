import { useState } from "react";

function AddRecipe() {
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    instructions: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("/recipes/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage("Recipe added successfully!");
        setForm({ title: "", ingredients: "", instructions: "" });
      } else {
        setMessage("Failed to add recipe.");
      }
    } catch (error) {
      setMessage("An error occurred.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Recipe</h2>
      {message && <p>{message}</p>}
      <label>
        Title:
        <input name="title" value={form.title} onChange={handleChange} />
      </label>
      <label>
        Ingredients:
        <textarea
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
        />
      </label>
      <label>
        Instructions:
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Add Recipe</button>
    </form>
  );
}

export default AddRecipe;