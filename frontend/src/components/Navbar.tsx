import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!token) return null; // Hide navbar if user not logged in

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-gray-900 text-white px-6 py-3 shadow-md flex items-center">
            {/* Left Navigation */}
            <div className="flex gap-6 items-center">
                <Link
                    to="/home"
                    className="hover:text-blue-400"
                >
                    Dashboard
                </Link>

                <Link
                    to="/authors"
                    className="hover:text-blue-400 transition font-medium"
                >
                    Authors
                </Link>

                <Link
                    to="/books"
                    className="hover:text-blue-400 transition font-medium"
                >
                    Books
                </Link>

                <Link
                    to="/borrowed"
                    className="hover:text-blue-400 transition font-medium"
                >
                    Borrowed Books
                </Link>
            </div>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg font-medium"
            >
                Logout
            </button>
        </nav>
    );
}
