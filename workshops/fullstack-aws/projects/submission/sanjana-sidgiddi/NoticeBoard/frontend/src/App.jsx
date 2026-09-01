import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/notices";

function App() {
  const [notices, setNotices] = useState([]);

  const [form, setForm] = useState({
    title: "",
    message: "",
    author: "",
    date: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editMode, setEditMode] = useState(null);

  const fetchNotices = async () => {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    setNotices(data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const clearForm = () => {
    setForm({
      title: "",
      message: "",
      author: "",
      date: "",
    });

    setEditingId(null);
    setEditMode(null);
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    await fetch(`${API_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    clearForm();
    fetchNotices();
  };

  const startPutEdit = (notice) => {
    setEditingId(notice._id);
    setEditMode("PUT");

    setForm({
      title: notice.title,
      message: notice.message,
      author: notice.author,
      date: notice.date,
    });
  };

  const startPatchEdit = (notice) => {
    setEditingId(notice._id);
    setEditMode("PATCH");

    setForm({
      title: "",
      message: "",
      author: "",
      date: "",
    });
  };

  const handlePut = async () => {
    await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    clearForm();
    fetchNotices();
  };

  const handlePatch = async () => {
    const patchData = {};

    if (form.title !== "") {
      patchData.title = form.title;
    }

    if (form.message !== "") {
      patchData.message = form.message;
    }

    if (form.author !== "") {
      patchData.author = form.author;
    }

    if (form.date !== "") {
      patchData.date = form.date;
    }

    await fetch(`${API_URL}/${editingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patchData),
    });

    clearForm();
    fetchNotices();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchNotices();
  };

  return (
    <div className="app">
      <h1>Notice Board</h1>
      <p className="app-subtitle">
        The Latest Announcements in One Place!
      </p>

      <h2 className="section-title">Notices</h2>

      {notices.length === 0 ? (
        <div className="empty-state">
          No Notices Yet
        </div>
      ) : (
        <div className="notice-grid">
          {notices.map((notice) => (
            <div
              className="notice-card"
              key={notice._id}
            >
              <h3>{notice.title}</h3>

              <p className="notice-message">
                {notice.message}
              </p>

              <div className="notice-meta">
                <span>
                  <strong>Author:</strong>{" "}
                  {notice.author}
                </span>

                <span>
                  <strong>Date:</strong>{" "}
                  {notice.date}
                </span>
              </div>

              <div className="card-actions">
                <button
                  className="put-btn"
                  onClick={() =>
                    startPutEdit(notice)
                  }
                >
                 Edit
                </button>
                {/*}
                <button
                  className="patch-btn"
                  onClick={() =>
                    startPatchEdit(notice)
                  }
                >
                  EDIT - Update
                </button>
                */}

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(notice._id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <h2 className="section-title">
        _______________________________________________________
      </h2>
      <h2 className="section-title">Notice Form</h2>
      <form className="notice-form" onSubmit={handleCreate}>
        <div className="form-row">
          <input
            type="text"
            name="title"
            placeholder={
              editMode === "PATCH"
                ? "New title (optional)"
                : "Title"
            }
            value={form.title}
            onChange={handleChange}
            required={editMode !== "PATCH"}
          />

          <input
            type="text"
            name="author"
            placeholder={
              editMode === "PATCH"
                ? "New author (optional)"
                : "Author"
            }
            value={form.author}
            onChange={handleChange}
            required={editMode !== "PATCH"}
          />
        </div>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required={editMode !== "PATCH"}
        />

        <textarea
          name="message"
          placeholder={
            editMode === "PATCH"
              ? "New message (optional)"
              : "Message"
          }
          value={form.message}
          onChange={handleChange}
          required={editMode !== "PATCH"}
        />

        <div className="form-actions">
          {editMode === null && (
            <button
              className="create-btn"
              type="submit"
            >
              Create Notice
            </button>
          )}

          {editMode === "PUT" && (
            <>
              <button
                className="replace-btn"
                type="button"
                onClick={handlePut}
              >
                Replace Notice
              </button>

              <button
                className="cancel-btn"
                type="button"
                onClick={clearForm}
              >
                Cancel
              </button>
            </>
          )}
          {/*
          {editMode === "PATCH" && (
            <>
              <button
                className="patch-btn"
                type="button"
                onClick={handlePatch}
              >
                Update Notice
              </button>

              <button
                className="cancel-btn"
                type="button"
                onClick={clearForm}
              >
                Cancel
              </button>
            </>
          )}
          */}
        </div>
      </form>
    </div>
  );
}

export default App;