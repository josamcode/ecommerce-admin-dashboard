"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchProducts,
  fetchMessages,
  fetchOrders,
  fetchUsers,
} from "@/utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Package,
  Mail,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    messages: 0,
    users: 0,
    orders: 0,
    revenue: 0,
    growth: 0,
    userGrowth: 0,
    orderGrowth: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [products, messages, users, orders] = await Promise.all([
          fetchProducts(),
          fetchMessages(),
          fetchUsers(),
          fetchOrders(),
        ]);

        // Calculate total revenue from delivered orders
        const totalRevenue = orders.data.data
          .filter((order) => order.status === "delivered")
          .reduce((sum, order) => sum + order.totalPrice, 0);

        // Calculate growth percentage for revenue
        const lastMonthRevenue = orders.data.data
          .filter((order) => {
            const orderDate = new Date(order.createdAt);
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return orderDate >= lastMonth && order.status === "delivered";
          })
          .reduce((sum, order) => sum + order.totalPrice, 0);

        const revenueGrowth = lastMonthRevenue
          ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 0;

        // Calculate user growth (week over week)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const newUsersThisWeek = users.data.data.filter(
          (user) => new Date(user.createdAt) >= lastWeek
        ).length;
        const userGrowth = users.data.data.length > 0
          ? (newUsersThisWeek / users.data.data.length) * 100
          : 0;

        // Calculate order growth (month over month)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const newOrdersThisMonth = orders.data.data.filter(
          (order) => new Date(order.createdAt) >= lastMonth
        ).length;
        const orderGrowth = orders.data.data.length > 0
          ? (newOrdersThisMonth / orders.data.data.length) * 100
          : 0;

        // Process orders data for the line chart
        const ordersByDate = orders.data.data.reduce((acc, order) => {
          const date = new Date(order.createdAt).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = {
              date,
              orders: 0,
              revenue: 0,
            };
          }
          acc[date].orders += 1;
          acc[date].revenue += order.totalPrice;
          return acc;
        }, {});

        const chartData = Object.values(ordersByDate)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-7);

        // Process product categories data
        const categoryCounts = products.data.data.reduce((acc, product) => {
          const category = product.category || "Uncategorized";
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const categoryData = Object.entries(categoryCounts).map(
          ([name, value]) => ({
            name,
            value,
          })
        );

        // Process order status data
        const statusCounts = orders.data.data.reduce((acc, order) => {
          const status = order.status || "Pending";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const orderStatusData = Object.entries(statusCounts).map(
          ([name, value]) => ({
            name,
            value,
          })
        );

        setStats({
          products: products.data.totalProducts,
          messages: messages.data.length,
          users: users.data.length,
          orders: orders.data.totalOrders,
          revenue: totalRevenue,
          growth: Math.round(revenueGrowth * 100) / 100,
          userGrowth: Math.round(userGrowth * 100) / 100,
          orderGrowth: Math.round(orderGrowth * 100) / 100,
        });

        setChartData(chartData);
        setCategoryData(categoryData);
        setOrderStatusData(orderStatusData);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Analytics Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/orders" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${stats.revenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">
                  +{stats.growth}% from last month
                </span>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/users" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Users
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.users}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">
                  +{stats.userGrowth}% this week
                </span>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/orders" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Orders
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.orders}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">
                  +{stats.orderGrowth}% this month
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trend Chart */}
          <Link href="/dashboard/orders" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Sales Trend
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="orders"
                      stroke="#4F46E5"
                      name="Orders"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      name="Revenue ($)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Link>

          {/* Product Categories Chart */}
          <Link href="/dashboard/products" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Product Categories
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Link>
        </div>

        {/* Order Status Chart */}
        <Link href="/dashboard/orders" className="block">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Status Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Link>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/products" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Products
                </h2>
                <Package className="h-6 w-6 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.products}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Total products in inventory
              </p>
            </div>
          </Link>

          <Link href="/dashboard/messages" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Messages
                </h2>
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.messages}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Total customer messages
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
