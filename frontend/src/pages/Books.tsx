import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", isbn: "", authorId: "" });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch authors
  const fetchAuthors = async () => {
    const res = await API.get("/authors");
    setAuthors(res.data);
  };

  // Fetch books
  const fetchBooks = async () => {
    const res = await API.get("/books", {
      params: { search: search || undefined },
    });
    setBooks(res.data);
  };

  useEffect(() => {
    fetchAuthors();
    fetchBooks();
  }, [search]);

  // Borrow a book
  const borrowBook = async (bookId: number) => {
    try {
      await API.post(`/borrow/${bookId}`);
      toast.success("Book borrowed!");
      fetchBooks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Borrow failed");
    }
  };

  // Return a book
  const returnBook = async (bookId: number) => {
    try {
      await API.post(`/borrow/return/${bookId}`);
      toast.success("Book returned!");
      fetchBooks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Return failed");
    }
  };

  // Create or update book
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title: form.title,
        isbn: form.isbn,
        authorId: Number(form.authorId),
      };

      if (editingId) {
        await API.put(`/books/${editingId}`, payload);
        toast.success("Book updated!");
      } else {
        await API.post("/books", payload);
        toast.success("Book added!");
      }

      setForm({ title: "", isbn: "", authorId: "" });
      setEditingId(null);
      fetchBooks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // Edit handler
  const handleEdit = (book: any) => {
    setForm({
      title: book.title,
      isbn: book.isbn || "",
      authorId: book.authorId.toString(),
    });
    setEditingId(book.id);
  };

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    await API.delete(`/books/${id}`);
    fetchBooks();
  };

  return (
    <div className="p-6">

      <h2 className="text-3xl font-bold mb-6">Books Management</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search books..."
        className="p-3 w-full max-w-md border rounded-lg mb-6 focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-xl">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Book" : "Add New Book"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Book Title"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="ISBN (optional)"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          />

          <select
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.authorId}
            onChange={(e) => setForm({ ...form, authorId: e.target.value })}
            required
          >
            <option value="">Select Author</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {editingId ? "Update Book" : "Add Book"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: "", isbn: "", authorId: "" });
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Books Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">All Books</h3>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">ISBN</th>
              <th className="p-3 border">Author</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-100 transition">

                <td className="p-3 border">{book.id}</td>
                <td className="p-3 border">{book.title}</td>
                <td className="p-3 border">{book.isbn}</td>
                <td className="p-3 border">{book.author?.name}</td>

                {/* Borrowed Badge */}
                <td className="p-3 border">
                  {book.isBorrowed ? (
                    <span className="bg-red-500 text-white px-3 py-1 rounded">
                      Borrowed
                    </span>
                  ) : (
                    <span className="bg-green-500 text-white px-3 py-1 rounded">
                      Available
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-3 border flex gap-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                  {!book.isBorrowed ? (
                    <button
                      onClick={() => borrowBook(book.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Borrow
                    </button>
                  ) : (
                    <button
                      onClick={() => returnBook(book.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                    >
                      Return
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
