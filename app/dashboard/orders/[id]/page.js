"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrder } from "@/utils/api";

const OrderDetails = ({ order }) => {
  const router = useRouter();

  const handleClick = (id) => {
    router.push(`/dashboard/products/${id}`);
  };

  const { userInfo, cart, paymentMethod, totalPrice, status, createdAt } =
    order;

  console.log(cart);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      <section className="mb-8 p-4 bg-white shadow rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <p>
          <strong>Name:</strong> {userInfo.name}
        </p>
        <p>
          <strong>Email:</strong> {userInfo.email}
        </p>
        <p>
          <strong>Phone:</strong> {userInfo.phone}
        </p>
        <p>
          <strong>Address:</strong>{" "}
          {`${userInfo.street}, ${userInfo.state},  ${userInfo.city}, ${userInfo.country}`}
        </p>
      </section>

      <section className="mb-8 p-4 bg-white shadow rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center overflow-auto space-x-4">
              <Image
                src={`https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/${item.image}`}
                alt={item.name}
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <p
                  className="text-left font-bold whitespace-nowrap text-blue-700 cursor-pointer"
                  onClick={() => handleClick(item._id)}
                >
                  {item.name}
                </p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
                <p>Product ID: {item._id}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 p-4 bg-white shadow rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p>
          <strong>Payment Method:</strong> {paymentMethod}
        </p>
        <p>
          <strong>Total Price:</strong> ${totalPrice}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Created At:</strong> {new Date(createdAt).toLocaleString()}
        </p>
      </section>
    </div>
  );
};

export default function Dashboard() {
  const [order, setOrder] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const response = await getOrder(id);
          setOrder(response.data);
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      };

      fetchOrder();
    }
  }, [id]);

  if (!order) {
    return <p>Loading...</p>;
  }

  return <OrderDetails order={order} />;
}
