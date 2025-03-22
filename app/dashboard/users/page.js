"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

// Mock API functions for fetching and deleting users
const fetchUsers = async () => {
  const response = await fetch("https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/auth/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

const deleteUser = async (id) => {
  const response = await fetch(`https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/auth/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete user");
};

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  // Handle user deletion
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire("Deleted!", "The user has been deleted.", "success");
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the user.", "error");
      }
    }
  };

  // Filter users based on search query (username, email, or phone number)
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.includes(searchQuery))
  );

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
      </div>

      <input
        type="text"
        placeholder="Search users by Username, Email, or Phone Number..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full table-auto text-left bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm font-semibold">
            <tr>
              <th className="py-4 px-6">Username</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Phone Number</th>
              <th className="py-4 px-6">Created At</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{user.username}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.phoneNumber || "N/A"}</td>
                  <td className="py-4 px-6">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 px-6 text-center">
                  No Users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
