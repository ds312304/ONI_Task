import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Home() {
  const [stats, setStats] = useState({
    authors: 0,
    books: 0,
    borrowed: 0,
    available: 0,
  });

  const fetchStats = async () => {
    const authors = await API.get("/authors");
    const books = await API.get("/books");
    const borrowed = books.data.filter((b: any) => b.isBorrowed).length;

    setStats({
      authors: authors.data.length,
      books: books.data.length,
      borrowed,
      available: books.data.length - borrowed,
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold">Authors</h3>
          <p className="text-4xl mt-2">{stats.authors}</p>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold">Books</h3>
          <p className="text-4xl mt-2">{stats.books}</p>
        </div>

        <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold">Borrowed</h3>
          <p className="text-4xl mt-2">{stats.borrowed}</p>
        </div>

        <div className="bg-yellow-500 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold">Available</h3>
          <p className="text-4xl mt-2">{stats.available}</p>
        </div>

      </div>
    </div>
  );
}
