"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { fetchMessages, deleteMessages } from "@/utils/api";
import Swal from "sweetalert2";

export default function MessageTable() {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => { 
      try {
        const response = await fetchMessages();
        setMessages(response.data.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchData();
  }, []);

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
        await deleteMessages(id);
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
        setMessages(messages.filter((msg) => msg._id !== id));
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the product.", "error");
      }
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Message Management</h1>
      </div>

      <input
        type="text"
        placeholder="Search messages by Name, Email and message..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full table-auto text-left bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm font-semibold">
            <tr>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Message</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredMessages?.length > 0 ? (
              filteredMessages.map((msg) => (
                <tr key={msg._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 min-w-40">{msg.name}</td>
                  <td className="py-4 px-6">{msg.email}</td>
                  <td className="py-4 px-6">{msg.message}</td>
                  <td className="py-4 px-6">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDelete(msg._id)}
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
                  No Messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
