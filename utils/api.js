import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://eastern-maryjane-josamcode-baebec38.koyeb.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = (userData) =>
  apiClient.post("/api/auth/register", userData);
export const loginUser = (credentials) =>
  apiClient.post("/api/auth/login", credentials);
export const fetchUser = () => apiClient.get("/api/user/me");
export const fetchProducts = () => apiClient.get("/api/products");
export const fetchProduct = (id) => apiClient.get(`/api/products/${id}`);

export const createProduct = (productData) =>
  apiClient.post("/api/products/featured-products", productData);
export const updateProduct = (id, productData) =>
  apiClient.put(`/api/products/featured-products/${id}`, productData);
export const deleteProduct = (id) =>
  apiClient.delete(`/api/products/${id}`);
export const fetchMessages = () => apiClient.get("/api/messages");
export const deleteMessages = (id) => apiClient.delete(`/api/messages/${id}`);
export const fetchOrders = () => apiClient.get("/api/orders");
export const fetchUsers = () => apiClient.get("/api/auth/users");
export const getOrder = (id) => apiClient.get(`/api/orders/${id}`);
export const createOrder = (orderData) =>
  apiClient.post("/api/orders", orderData);
export const updateOrder = (id, orderData) =>
  apiClient.put(`/api/orders/${id}`, orderData);
export const deleteOrder = (id) => apiClient.delete(`/api/orders/${id}`);
