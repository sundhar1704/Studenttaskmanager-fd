import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
 
const API_URL = `${import.meta.env.VITE_API_URL}/tasks/`;
 
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
 
  async function loadTasks() {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
      setError("");
    } catch {
      setError("Unable to load tasks. Check the Django server.");
    } finally {
      setLoading(false);
    }
  }
 
  useEffect(() => {
    loadTasks();
  }, []);
 
  async function addTask(event) {
    event.preventDefault();
 
    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }
 
    try {
      await axios.post(API_URL, {
        title,
        description,
        completed: false,
      });
 
      setTitle("");
      setDescription("");
      setError("");
      await loadTasks();
    } catch {
      setError("Could not create the task.");
    }
  }
 
  async function toggleTask(task) {
    try {
      await axios.patch(`${API_URL}${task.id}/`, {
        completed: !task.completed,
      });
      await loadTasks();
    } catch {
      setError("Could not update the task.");
    }
  }
 
  async function deleteTask(id) {
    try {
      await axios.delete(`${API_URL}${id}/`);
      await loadTasks();
    } catch {
      setError("Could not delete the task.");
    }
  }
 
  return (
<main className="container">
<header>
<p className="eyebrow">STUDENT PRODUCTIVITY</p>
<h1>My Task Manager</h1>
<p>Plan your work. Track your progress.</p>
</header>
 
      <form className="task-form" onSubmit={addTask}>
<h2>Add a new task</h2>
 
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          maxLength={200}
          required
        />
 
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description (optional)"
        />
 
        <button type="submit">+ Add Task</button>
</form>
 
      {error && <p className="error">{error}</p>}
 
      <section className="task-section">
<h2>Your tasks ({tasks.length})</h2>
 
        {loading ? (
<p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
<p>No tasks yet. Add your first task!</p>
        ) : (
          tasks.map((task) => (
<article className="task-card" key={task.id}>
<div>
<h3 className={task.completed ? "done" : ""}>
                  {task.title}
</h3>
<p>{task.description || "No description"}</p>
<small>
                  {task.completed ? "Completed" : "Pending"}
</small>
</div>
 
              <div className="actions">
<button
                  type="button"
                  onClick={() => toggleTask(task)}
>
                  {task.completed ? "Undo" : "Complete"}
</button>
 
                <button
                  type="button"
                  className="delete"
                  onClick={() => deleteTask(task.id)}
>
                  Delete
</button>
</div>
</article>
          ))
        )}
</section>
</main>
  );
}
 
export default App;