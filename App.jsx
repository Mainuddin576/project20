import { useEffect, useState } from "react";

const API = "/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Todos load nahi hue");
      setTodos(await res.json());
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Todo add nahi hua");
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateTodo(id, data) {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update fail hua");
      const updated = await res.json();
      setTodos(todos.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTodo(id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete fail hua");
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(todo) {
    setEditingId(todo._id);
    setEditTitle(todo.title);
  }

  async function saveEdit(id) {
    if (!editTitle.trim()) return;
    await updateTodo(id, { title: editTitle });
    setEditingId(null);
  }

  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.completed : !t.completed
  );
  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="container">
      <h1>MERN Todo</h1>

      <form className="add-form" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Naya kaam likho..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="filters">
        {["all", "pending", "done"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : visible.length === 0 ? (
        <p className="muted">Koi todo nahi hai.</p>
      ) : (
        <ul className="list">
          {visible.map((todo) => (
            <li key={todo._id} className={todo.completed ? "done" : ""}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  updateTodo(todo._id, { completed: !todo.completed })
                }
              />

              {editingId === todo._id ? (
                <input
                  className="edit-input"
                  value={editTitle}
                  autoFocus
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(todo._id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <span className="title">{todo.title}</span>
              )}

              <div className="actions">
                {editingId === todo._id ? (
                  <button onClick={() => saveEdit(todo._id)}>Save</button>
                ) : (
                  <button onClick={() => startEdit(todo)}>Edit</button>
                )}
                <button className="danger" onClick={() => deleteTodo(todo._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="muted">{remaining} kaam baaki hain</p>
    </div>
  );
}
