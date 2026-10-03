import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Check,
  CheckCheck,
  ClipboardList,
  Clock3,
  ListTodo,
  LoaderCircle,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { api } from "./services/todoApi";
import type { Todo, TodoFilter } from "./types/todo";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState<string | null>(null);
  const [et, setEt] = useState("");
  const [ed, setEd] = useState("");

  // =========================
  // Load Tasks
  // =========================

  async function load() {
    try {
      setError("");

      const data = await api.list();
      setTodos(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not load tasks"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  // =========================
  // Statistics
  // =========================

  const active = todos.filter(
    (todo) => !todo.completed
  ).length;

  const done = todos.length - active;

  // =========================
  // Filter + Search
  // =========================

  const visible = useMemo(() => {
    return todos.filter((todo) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !todo.completed) ||
        (filter === "completed" && todo.completed);

      const searchText =
        `${todo.title} ${todo.description}`.toLowerCase();

      const matchesSearch = searchText.includes(
        search.trim().toLowerCase()
      );

      return matchesFilter && matchesSearch;
    });
  }, [todos, filter, search]);

  // =========================
  // Add Task
  // =========================

  async function add(e: FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setSaving(true);

    try {
      const todo = await api.create(
        title.trim(),
        description.trim()
      );

      setTodos((current) => [todo, ...current]);

      setTitle("");
      setDescription("");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Create failed"
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // Toggle Task
  // =========================

  async function toggle(todo: Todo) {
    try {
      const updated = await api.toggle(todo.id);

      setTodos((current) =>
        current.map((item) =>
          item.id === todo.id ? updated : item
        )
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Update failed"
      );
    }
  }

  // =========================
  // Delete Task
  // =========================

  async function remove(id: string) {
    try {
      await api.remove(id);

      setTodos((current) =>
        current.filter((todo) => todo.id !== id)
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Delete failed"
      );
    }
  }

  // =========================
  // Edit Task
  // =========================

  function edit(todo: Todo) {
    setEditing(todo.id);
    setEt(todo.title);
    setEd(todo.description);
  }

  // =========================
  // Save Edited Task
  // =========================

  async function save(e: FormEvent) {
    e.preventDefault();

    if (!editing || !et.trim()) {
      return;
    }

    try {
      const updated = await api.update(
        editing,
        et.trim(),
        ed.trim()
      );

      setTodos((current) =>
        current.map((todo) =>
          todo.id === editing ? updated : todo
        )
      );

      setEditing(null);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Save failed"
      );
    }
  }

  // =========================
  // Current Date
  // =========================

  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  // =========================
  // UI
  // =========================

  return (
    <main className="shell">

      {/* =====================
          Sidebar
      ====================== */}

      <aside className="sidebar">
        <a className="brand">
          <span className="mark">
            <CheckCheck />
          </span>

          taskflow
          <span className="purple">.</span>
        </a>

        <div className="side-label">
          WORKSPACE
        </div>

        <div className="side-active">
          <ListTodo />

          My tasks

          <b>{todos.length}</b>
        </div>

        <div className="side-bottom">

          <div className="tip">
            <Sparkles />

            <strong>
              Make today count.
            </strong>

            <p>
              Small steps lead to big things.
              Keep going!
            </p>
          </div>

          <div className="profile">
            <i>T</i>

            <div>
              <b>TaskFlow User</b>

              <small>
                Personal workspace
              </small>
            </div>
          </div>

        </div>
      </aside>

      {/* =====================
          Main Content
      ====================== */}

      <section className="main">

        {/* Header */}

        <header className="top">
          <span>
            Workspace　/　My tasks
          </span>

          <span>
            <Clock3 size={15} />

            {date}
          </span>
        </header>

        <div className="content">

          {/* =====================
              Welcome Section
          ====================== */}

          <div className="welcome">

            <div>
              <small className="eyebrow">
                ● YOUR PERSONAL SPACE
              </small>

              <h1>
                Good things take <em>time.</em>
              </h1>

              <p>
                A little progress each day adds up
                to big results.
              </p>
            </div>

            <div className="hero">
              <ClipboardList />

              <sup>✦</sup>
            </div>

          </div>

          {/* =====================
              Statistics
          ====================== */}

          <div className="stats">

            <div>
              <label>Total tasks</label>

              <strong>
                {String(todos.length).padStart(2, "0")}
              </strong>

              <small>
                Everything on your list
              </small>
            </div>

            <div>
              <label>In progress</label>

              <strong>
                {String(active).padStart(2, "0")}
              </strong>

              <small>
                One step at a time
              </small>
            </div>

            <div>
              <label>Completed</label>

              <strong>
                {String(done).padStart(2, "0")}
              </strong>

              <small>
                Look how far you've come
              </small>
            </div>

          </div>

          {/* =====================
              Tasks Section
          ====================== */}

          <section className="tasks">

            <h2>
              My tasks
              <span>{todos.length}</span>
            </h2>

            <p className="hint">
              Keep your priorities clear and your
              momentum going.
            </p>

            {/* =====================
                Add Task Form
            ====================== */}

            <form
              className="add"
              onSubmit={add}
            >
              <b>
                <i>
                  <Plus size={16} />
                </i>

                Add a new task
              </b>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="What needs to get done?"
                maxLength={160}
                required
              />

              <input
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Add a note (optional)"
                maxLength={1000}
              />

              <div>
                <small>
                  Press the button to add it to
                  your list
                </small>

                <button
                  disabled={
                    saving || !title.trim()
                  }
                >
                  {saving ? (
                    <LoaderCircle className="spin" />
                  ) : (
                    <Plus />
                  )}

                  Add task
                </button>
              </div>
            </form>

            {/* =====================
                Error Message
            ====================== */}

            {error && (
              <div className="error">
                {error}

                <button
                  onClick={() => setError("")}
                >
                  <X />
                </button>
              </div>
            )}

            {/* =====================
                Toolbar
            ====================== */}

            <div className="toolbar">

              <nav>
                {(
                  [
                    "all",
                    "active",
                    "completed",
                  ] as TodoFilter[]
                ).map((filterType) => (
                  <button
                    className={
                      filter === filterType
                        ? "chosen"
                        : ""
                    }
                    onClick={() =>
                      setFilter(filterType)
                    }
                    key={filterType}
                  >
                    {filterType === "all"
                      ? "All tasks"
                      : filterType === "active"
                        ? "In progress"
                        : "Completed"}
                  </button>
                ))}
              </nav>

              <label className="search">
                <Search />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search tasks..."
                />
              </label>

            </div>

            {/* =====================
                Task List
            ====================== */}

            <div className="list">

              {/* Loading */}

              {loading ? (
                <div className="empty">
                  <LoaderCircle className="spin" />

                  Loading your tasks...
                </div>

              /* Empty State */

              ) : visible.length === 0 ? (
                <div className="empty">

                  <CheckCheck />

                  <b>
                    {search
                      ? "No matching tasks"
                      : filter === "completed"
                        ? "Nothing completed yet"
                        : "Your list is clear"}
                  </b>

                  <small>
                    Add a task above and make your
                    day count.
                  </small>

                </div>

              /* Task Items */

              ) : (
                visible.map((todo) => (
                  <article
                    className="todo"
                    key={todo.id}
                  >

                    {/* Complete Button */}

                    <button
                      className={
                        "check " +
                        (todo.completed
                          ? "checked"
                          : "")
                      }
                      onClick={() =>
                        void toggle(todo)
                      }
                      aria-label="Toggle completion"
                    >
                      {todo.completed ? (
                        <Check />
                      ) : (
                        "○"
                      )}
                    </button>

                    {/* Edit Mode */}

                    {editing === todo.id ? (
                      <form
                        className="edit"
                        onSubmit={save}
                      >
                        <input
                          value={et}
                          onChange={(e) =>
                            setEt(e.target.value)
                          }
                        />

                        <input
                          value={ed}
                          onChange={(e) =>
                            setEd(e.target.value)
                          }
                          placeholder="Description"
                        />

                        <button>
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setEditing(null)
                          }
                        >
                          Cancel
                        </button>
                      </form>

                    /* Normal Task */

                    ) : (
                      <button
                        className="copy"
                        onClick={() =>
                          edit(todo)
                        }
                      >
                        <b
                          className={
                            todo.completed
                              ? "strike"
                              : ""
                          }
                        >
                          {todo.title}
                        </b>

                        {todo.description && (
                          <small>
                            {todo.description}
                          </small>
                        )}
                      </button>
                    )}

                    {/* Status */}

                    <span
                      className={
                        "pill " +
                        (todo.completed
                          ? "done"
                          : "pending")
                      }
                    >
                      {todo.completed
                        ? "Done"
                        : "In progress"}
                    </span>

                    {/* Delete */}

                    <button
                      className="delete"
                      onClick={() =>
                        void remove(todo.id)
                      }
                      aria-label="Delete"
                    >
                      <Trash2 />
                    </button>

                  </article>
                ))
              )}

            </div>

            {/* =====================
                Footer Information
            ====================== */}

            <div className="foot">

              <span>
                Showing <b>{visible.length}</b>{" "}
                of <b>{todos.length}</b> tasks
              </span>

              <span>
                ● Synced with your database
              </span>

            </div>

          </section>

          {/* Footer */}

          <footer>
            Made for a more focused day
            <span>✦</span>
          </footer>

        </div>
      </section>
    </main>
  );
}
