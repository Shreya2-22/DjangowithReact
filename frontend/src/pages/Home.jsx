// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Note from "../components/Note";
import "../styles/NoteStyles.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          if (window.confirm("Are you sure you want to delete this note?")) {
            getNotes();
          }
        } else {
          alert("Error deleting note");
        }
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { title, content })
      .then((res) => {
        if (res.status === 201) {
          setTitle("");
          setContent("");
          return getNotes();
        } else {
          alert("Error creating note");
        }
      })
      .then(() => {
        alert("Note created successfully");
      })
      .catch((error) => alert(error));
  };

  const handleLogout = () => {
    // Clear tokens (and any other auth state)
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="home-container">
      <header className="notes-header">
        <h2>Notes</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="notes-list">
        {notes.map((note) => (
          <Note note={note} deleteNote={deleteNote} key={note.id} />
        ))}
      </div>

      <section className="create-note">
        <h2>Create a Note</h2>
        <form onSubmit={createNote}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />

          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
        
      </section>
      
    </div>
  );
}

export default Home;
