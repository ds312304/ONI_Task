import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Authors() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch authors
  const fetchAuthors = async () => {
    const res = await API.get("/authors");
    setAuthors(res.data);
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/authors/${editingId}`, form);
        toast.success("Author updated!");
      } else {
        await API.post("/authors", form);
        toast.success("Author created!");
      }

      setForm({ name: "", bio: "" });
      setEditingId(null);
      fetchAuthors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (author: any) => {
    setForm({ name: author.name, bio: author.bio || "" });
    setEditingId(author.id);
  };

  const handleDelete = async (id: number) => {
    try{
        await API.delete(`/authors/${id}`);
        toast.success("Author deleted!");
    }catch(error: any){
        toast.error(error.response?.data?.message || "Failed to delete author");
    }
    fetchAuthors();
  };

  return (
    <div className="p-6">

      <h2 className="text-3xl font-bold mb-6">Authors Management</h2>

      {/* Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-xl">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Author" : "Add New Author"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Author Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <textarea
            placeholder="Bio (optional)"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {editingId ? "Update Author" : "Add Author"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", bio: "" });
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">All Authors</h3>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Bio</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {authors.map((author) => (
              <tr
                key={author.id}
                className="hover:bg-gray-100 transition"
              >
                <td className="p-3 border">{author.id}</td>
                <td className="p-3 border">{author.name}</td>
                <td className="p-3 border">{author.bio}</td>

                <td className="p-3 border flex gap-3">
                  <button
                    onClick={() => handleEdit(author)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(author.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
