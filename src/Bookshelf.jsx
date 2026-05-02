import React, { useState, useEffect } from "react";
import axios from "axios";

const Bookshelf = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const API_URL = "http://localhost:3000/books";

  const fetchBooks = async () => {
    try {
      let res = await axios.get(API_URL);
      if (res.status == 200) {
        setBooks(res.data);
      }
    } catch (err) {
      console.error(err);
      alert("something went wrong while fetching");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async () => {
    if (!title || !author) return;
    await axios.post(API_URL, { title, author, status: "Queue" });
    setTitle("");
    setAuthor("");
    fetchBooks();
  };

  const moveBook = async (id, newStatus) => {
    const bookToUpdate = books.find((b) => b.id === id);
    await axios.put(`${API_URL}/${id}`, { ...bookToUpdate, status: newStatus });
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchBooks();
  };

  const ActionButtons = ({ book }) => (
    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-100">
      {book.status !== "Queue" && (
        <button onClick={() => moveBook(book.id, "Queue")} className="text-[10px] uppercase tracking-wider font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded hover:bg-amber-100">
          Queue
        </button>
      )}
      {book.status !== "Reading" && (
        <button onClick={() => moveBook(book.id, "Reading")} className="text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">
          Reading
        </button>
      )}
      {book.status !== "Completed" && (
        <button onClick={() => moveBook(book.id, "Completed")} className="text-[10px] uppercase tracking-wider font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded hover:bg-emerald-100">
          Finish
        </button>
      )}
      <button onClick={() => deleteBook(book.id)} className="text-[10px] uppercase tracking-wider font-bold bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 ml-auto">
        Delete
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-black text-slate-800 mb-6">Digital Bookshelf</h1>
        <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book Title" className="flex-1 p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" className="flex-1 p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          <button onClick={addBook} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
            Add to Library
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* QUEUE */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-black text-slate-400 uppercase tracking-widest text-sm">The Queue</h3>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">{books.filter((b) => b.status === "Queue").length}</span>
          </div>
          <div className="bg-slate-200/50 p-3 rounded-3xl min-h-[500px]">
            {books
              .filter((b) => b.status === "Queue")
              .map((book) => (
                <div key={book.id} className="bg-white p-5 rounded-2xl shadow-sm mb-3 border border-transparent hover:border-blue-200 transition-all">
                  <h4 className="font-bold text-slate-800">{book.title}</h4>
                  <p className="text-sm text-slate-500 italic">{book.author}</p>
                  <ActionButtons book={book} />
                </div>
              ))}
          </div>
        </div>

        {/* READING */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-black text-blue-500 uppercase tracking-widest text-sm">Reading</h3>
            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">{books.filter((b) => b.status === "Reading").length}</span>
          </div>
          <div className="bg-blue-50/50 p-3 rounded-3xl min-h-[500px] border-2 border-dashed border-blue-100">
            {books
              .filter((b) => b.status === "Reading")
              .map((book) => (
                <div key={book.id} className="bg-white p-5 rounded-2xl shadow-md mb-3 border-l-4 border-blue-500">
                  <h4 className="font-bold text-slate-800">{book.title}</h4>
                  <p className="text-sm text-slate-500 italic">{book.author}</p>
                  <ActionButtons book={book} />
                </div>
              ))}
          </div>
        </div>

        {/* COMPLETED */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-black text-emerald-500 uppercase tracking-widest text-sm">Completed</h3>
            <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full">{books.filter((b) => b.status === "Completed").length}</span>
          </div>
          <div className="bg-emerald-50/50 p-3 rounded-3xl min-h-[500px]">
            {books
              .filter((b) => b.status === "Completed")
              .map((book) => (
                <div key={book.id} className="bg-white p-5 rounded-2xl shadow-sm mb-3 opacity-80 ring-1 ring-emerald-100">
                  <h4 className="font-bold text-slate-800 line-through decoration-emerald-500/30">{book.title}</h4>
                  <p className="text-sm text-slate-500 italic">{book.author}</p>
                  <ActionButtons book={book} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookshelf;
