"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, CheckCircle, XCircle, Truck } from "lucide-react";

const EditOrderPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [status, setStatus] = useState("placed");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/orders/${id}`
        );
        const { status: fetchedStatus } = response.data;
        setStatus(fetchedStatus);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updatedOrder = { status };
      await axios.put(`https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/orders/${id}`, updatedOrder);
      router.push("/dashboard/orders");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (isLoading)
    return <p className="text-center text-gray-500">Loading order...</p>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-md">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <ShoppingCart size={24} /> Edit Order
      </h1>

      {/* Status Selection */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="placed" className="flex items-center">
            Placed
          </option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        className="w-full cursor-pointer bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition duration-300"
      >
        Update Order
      </button>
    </div>
  );
};

export default EditOrderPage;
