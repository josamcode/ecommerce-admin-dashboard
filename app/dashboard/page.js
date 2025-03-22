"use client";

import {
  fetchProducts,
  fetchMessages,
  fetchOrders,
  fetchUsers,
} from "@/utils/api";
import { useEffect, useState } from "react";

import { Package, Mail, ShoppingCart, Users } from "lucide-react";

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    // Fetch product count
    fetchProducts()
      .then((response) => {
        console.log(response);

        setProductCount(response.data.totalProducts);
      })
      .catch((error) => console.error("Error fetching products:", error));

    // Fetch message count
    fetchMessages()
      .then((response) => {
        setMessageCount(response.data.length); // Assuming response.data is an array of messages
      })
      .catch((error) => console.error("Error fetching messages:", error));

    // Fetch message count
    fetchUsers()
      .then((response) => {
        setUsersCount(response.data.length); // Assuming response.data is an array of messages
      })
      .catch((error) => console.error("Error fetching users:", error));

    // Fetch order count
    fetchOrders()
      .then((response) => {
        setOrderCount(response.data.totalOrders); // Assuming response.data is an array of orders
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Card */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Package className="text-4xl text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Products</h2>
          <p className="text-3xl font-bold text-gray-700">{productCount}</p>
        </div>

        {/* Product Card */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Users className="text-4xl text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Users</h2>
          <p className="text-3xl font-bold text-gray-700">{usersCount}</p>
        </div>

        {/* Messages Card */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Mail className="text-4xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <p className="text-3xl font-bold text-gray-700">{messageCount}</p>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <ShoppingCart className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
          <p className="text-3xl font-bold text-gray-700">{orderCount}</p>
        </div>
      </div>
    </div>
  );
}
