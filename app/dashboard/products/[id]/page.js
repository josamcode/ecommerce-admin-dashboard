"use client";

import { deleteProduct, fetchProduct } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StarIcon, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

export default function ViewProductPage() {
  const router = useRouter();

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id).then((res) => setProduct(res.data));
    }
  }, [id]);

  if (!product) {
    return (
      <p className="text-center text-gray-500">Loading product details...</p>
    );
  }

  const handleEditClick = (id) => {
    router.push(`/dashboard/products/edit/${id}`);
  };

  const handleDelete = async (id, page = "yes") => {
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
        router.push("/dashboard/products");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the product.", "error");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className=" sm:text-3xl font-bold text-gray-800">{product.name}</h1>
          <div className="flex gap-2">
            <button
              className="p-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
              onClick={() => handleEditClick(product._id)}
            >
              <Edit className="w-5 h-5" /> Edit
            </button>
            <button
              className="p-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2 cursor-pointer"
              onClick={() => handleDelete(product._id, "not page")}
            >
              <Trash2 className="w-5 h-5" /> Delete
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Image
              src={"https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/" + product.images[0]}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-lg object-cover w-full h-auto"
            />
            <div className="flex flex-col gap-4">
              <p className="text-lg text-gray-700">{product.description}</p>
              <p className="text-xl font-semibold text-green-600">
                ${product.discountPrice || product.price}
              </p>
              {product.discountPrice && (
                <p className="text-xl font-semibold text-red-600 line-through">
                  ${product.price}
                </p>
              )}
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {product.rating} / 5 ({product.reviewsCount} reviews)
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Category:{" "}
                {product.category.map((category, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 rounded px-2 py-1 mx-1"
                  >
                    {category}
                  </span>
                ))}
              </p>
              <p className="text-sm text-gray-600">
                Product Collection:{" "}
                {product.productCollection ? (
                  <span className="bg-gray-200 rounded px-2 py-1 mx-1">
                    {product.productCollection}
                  </span>
                ) : (
                  <span className="text-gray-400 italic">Not specified</span>
                )}
              </p>

              <p className="text-sm text-gray-600">Brand: {product.brand}</p>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
              <p className="text-sm text-gray-600">Sold: {product.sold}</p>
              {product.specifications && (
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">Specifications</h2>
                  <p>Material: {product.specifications.material}</p>
                  <p>Size: {product.specifications.size}</p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Additional Images</h2>
            <div className="flex gap-4 overflow-auto">
              {product.images.length <= 1 ? (
                <p className="text-gray-400">No images found</p>
              ) : (
                product.images
                  .slice(1)
                  .map((img, index) => (
                    <Image
                      key={index}
                      src={`https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/${img}`}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
