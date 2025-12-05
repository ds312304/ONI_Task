import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function BorrowedBooks() {
  const { token } = useContext(AuthContext);
  const [borrowed, setBorrowed] = useState<any[]>([]);

  // Decode JWT to get user ID
  const getUserIdFromToken = () => {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub; // userId stored in "sub"
  };

  const userId = getUserIdFromToken();

  const fetchBorrowed = async () => {
    if (!userId) return;
    const res = await API.get(`/borrow/user/${userId}`);
    setBorrowed(res.data);
  };

  useEffect(() => {
    fetchBorrowed();
  }, []);

  return (
    <div className="p-6">

      <h2 className="text-3xl font-bold mb-6">Your Borrowed Books</h2>

      <div className="bg-white shadow-md rounded-lg p-6">
        {borrowed.length === 0 ? (
          <p className="text-gray-500 text-lg">No borrowed books yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border">Borrow ID</th>
                <th className="p-3 border">Book Title</th>
                <th className="p-3 border">Borrowed At</th>
                <th className="p-3 border">Returned At</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>

            <tbody>
              {borrowed.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-100 transition"
                >
                  <td className="p-3 border">{record.id}</td>
                  <td className="p-3 border">{record.book.title}</td>

                  <td className="p-3 border">
                    {new Date(record.borrowedAt).toLocaleString()}
                  </td>

                  <td className="p-3 border">
                    {record.returnedAt
                      ? new Date(record.returnedAt).toLocaleString()
                      : "—"}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3 border">
                    {record.returnedAt ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded">
                        Returned
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white px-3 py-1 rounded">
                        Not Returned
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
