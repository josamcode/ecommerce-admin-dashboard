"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteProduct, fetchProducts } from "@/utils/api";
import Swal from "sweetalert2";
import Link from "next/link";

export default function ProductTable() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts().then((res) => setProducts(res.data.data));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClick = (id) => {
    router.push(`/dashboard/products/${id}`);
  };

  const handleCreateClick = () => {
    router.push(`/dashboard/products/create`);
  };

  const handleEditClick = (id) => {
    router.push(`/dashboard/products/edit/${id}`);
  };

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
        await deleteProduct(id);
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the product.", "error");
      }
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <Link
          href="/dashboard/products/new"
          className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Product
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full table-auto text-left bg-white">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredProducts?.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td
                      className="py-4 px-6 cursor-pointer text-blue-600 hover:underline"
                      onClick={() => handleClick(product._id)}
                    >
                      {product.name}
                    </td>
                    <td className="py-4 px-6">${product.price || 0}</td>
                    <td className="py-4 px-6">{product.stock || 0}</td>
                    <td className="py-4 px-6 text-center space-x-4">
                      <button
                        className="text-gray-600 hover:text-blue-600 cursor-pointer"
                        onClick={() => handleEditClick(product._id)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 px-6 text-center">
                    No Products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
}
