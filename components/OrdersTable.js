"use client";

import { fetchOrders } from "@/utils/api";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const router = useRouter();

  const handleClick = (id) => {
    router.push(`/dashboard/orders/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOrders();
        setOrders(response.data.data);
        setFilteredOrders(response.data.data); // Initialize filtered orders with all orders
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle search input changes
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase(); // Convert query to lowercase for case-insensitive search
    setSearchQuery(query);

    if (!query) {
      setFilteredOrders(orders); // If search is cleared, show all orders
    } else {
      const filtered = orders.filter(
        (order) =>
          // Search across customer name and email
          order.userInfo.name.toLowerCase().includes(query) ||
          order.userInfo.email.toLowerCase().includes(query)
      );
      setFilteredOrders(filtered); // Update filtered orders
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(dateString));
  };

  const handleEditClick = (id) => {
    router.push(`/dashboard/orders/edit/${id}`);
  };

  return (
    <div className="container mx-auto rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Orders</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Customer Name or Email..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full table-auto text-left bg-white">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="py-4 px-6 text-left">Customer Name</th>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Total Price</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b cursor-pointer hover:bg-gray-50"
                  >
                    <td
                      className="py-4 px-6 text-gray-950"
                      onClick={() => handleClick(order._id)}
                    >
                      {order.userInfo.name}
                    </td>
                    <td
                      className="py-4 px-6"
                      onClick={() => handleClick(order._id)}
                    >
                      {order.userInfo.email}
                    </td>
                    <td
                      className="py-4 px-6 text-gray-950"
                      onClick={() => handleClick(order._id)}
                    >
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          order.status === "pending"
                            ? "bg-yellow-500"
                            : order.status === "placed"
                            ? "bg-blue-500"
                            : order.status === "shipped"
                            ? "bg-green-500"
                            : order.status === "delivered"
                            ? "bg-teal-500"
                            : order.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">{formatDate(order.createdAt)}</td>
                    <td className="py-4 px-6 text-center space-x-4">
                      <button
                        className="text-gray-600 hover:text-blue-600 z-50 cursor-pointer"
                        onClick={() => handleEditClick(order._id)}
                      >
                        <Pencil size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 px-6 text-center">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
