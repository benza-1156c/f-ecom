"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Nav/Navbar";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import AdminGuard from "@/lib/middleware/middleware";
import { api } from "@/lib/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 2450000,
    totalOrders: 1248,
    totalProducts: 156,
    totalUsers: 2891,
    todaySales: 125000,
    todayOrders: 45,
  });

  const [recentOrders] = useState([
    {
      id: "#ORD001",
      customer: "สมชาย ใจดี",
      total: 15750,
      status: "completed",
      date: "2024-05-29",
    },
    {
      id: "#ORD002",
      customer: "สมหญิง สวยงาม",
      total: 8900,
      status: "pending",
      date: "2024-05-29",
    },
    {
      id: "#ORD003",
      customer: "วิชัย มั่งมี",
      total: 42000,
      status: "processing",
      date: "2024-05-28",
    },
    {
      id: "#ORD004",
      customer: "สุดา น่ารัก",
      total: 25500,
      status: "completed",
      date: "2024-05-28",
    },
    {
      id: "#ORD005",
      customer: "ประเสริฐ ดีใจ",
      total: 12300,
      status: "cancelled",
      date: "2024-05-27",
    },
  ]);

  const [topProducts] = useState([
    { name: "iPhone 15 Pro Max", sales: 89, revenue: 4005000 },
    { name: "MacBook Air M2", sales: 45, revenue: 1890000 },
    { name: "iPad Air", sales: 67, revenue: 1675000 },
    { name: "AirPods Pro", sales: 156, revenue: 1388400 },
    { name: "Apple Watch Series 9", sales: 78, revenue: 1170000 },
  ]);

  const getStatusColor = (status: any) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: any) => {
    switch (status) {
      case "completed":
        return "สำเร็จ";
      case "pending":
        return "รอดำเนินการ";
      case "processing":
        return "กำลังดำเนินการ";
      case "cancelled":
        return "ยกเลิก";
      default:
        return status;
    }
  };

  const GetTotalProducts = async () => {
    try {
      const res = await fetch(`${api}/admin/products/count`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setStats((prev: any) => ({
          ...prev,
          totalProducts: data.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetTotalStats = async () => {
    try {
      const res = await fetch(`${api}/admin/users/count`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setStats((prev: any) => ({
          ...prev,
          totalUsers: data.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetTotalStats();
    GetTotalProducts();
  }, []);

  return (
    <>
      <AdminGuard />
      <Navbar />
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              แดชบอร์ดผู้ดูแลระบบ
            </h1>
            <p className="text-gray-400">ภาพรวมธุรกิจและการจัดการ</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "ยอดขายรวม",
                value: `฿${stats.totalSales.toLocaleString()}`,
                icon: "💰",
                href: "/admin/order",
                color: "bg-gradient-to-r from-purple-500 to-purple-600",
              },
              {
                title: "คำสั่งซื้อทั้งหมด",
                value: stats.totalOrders.toLocaleString(),
                icon: "📦",
                href: "/admin/order",
                color: "bg-gradient-to-r from-blue-500 to-blue-600",
              },
              {
                title: "สินค้าทั้งหมด",
                value: stats.totalProducts.toLocaleString(),
                icon: "🛍️",
                href: "/admin/product",
                color: "bg-gradient-to-r from-green-500 to-green-600",
              },
              {
                title: "สมาชิกทั้งหมด",
                value: stats.totalUsers.toLocaleString(),
                icon: "👥",
                href: "/admin/user",
                color: "bg-gradient-to-r from-orange-500 to-orange-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                className={`${stat.color} rounded-xl p-6 text-white shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="text-3xl opacity-80">{stat.icon}</div>
                </div>
                <Link href={stat.href}>
                  <Icon icon="mdi:arrow-right" width="24" height="24" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Today's Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                ประสิทธิภาพวันนี้
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">ยอดขายวันนี้</span>
                  <span className="text-xl font-bold text-green-400">
                    ฿{stats.todaySales.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">คำสั่งซื้อวันนี้</span>
                  <span className="text-xl font-bold text-blue-400">
                    {stats.todayOrders}
                  </span>
                </div>
                <div className="bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    style={{ width: "68%" }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">68% ของเป้าหมายรายวัน</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                การดำเนินการด่วน
              </h3>
              <div className="space-y-3">
                <motion.button
                  className="w-full bg-red-900/50 hover:bg-red-900/70 border border-red-800 text-red-300 p-3 rounded-lg text-left transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span>คำสั่งซื้อที่รอดำเนินการ</span>
                    <span className="bg-red-800 text-red-200 px-2 py-1 rounded-full text-xs font-medium">
                      15
                    </span>
                  </div>
                </motion.button>
                <motion.button
                  className="w-full bg-yellow-900/50 hover:bg-yellow-900/70 border border-yellow-800 text-yellow-300 p-3 rounded-lg text-left transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span>สินค้าที่ใกล้หมด</span>
                    <span className="bg-yellow-800 text-yellow-200 px-2 py-1 rounded-full text-xs font-medium">
                      8
                    </span>
                  </div>
                </motion.button>
                <motion.button
                  className="w-full bg-blue-900/50 hover:bg-blue-900/70 border border-blue-800 text-blue-300 p-3 rounded-lg text-left transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span>รีวิวใหม่ที่รอตอบกลับ</span>
                    <span className="bg-blue-800 text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                      23
                    </span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">
                    คำสั่งซื้อล่าสุด
                  </h3>
                  <motion.button
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    ดูทั้งหมด →
                  </motion.button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        คำสั่งซื้อ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ลูกค้า
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ยอดรวม
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        สถานะ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        วันที่
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {recentOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        className="hover:bg-gray-600 duration-300 cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          ฿{order.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {order.date}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800 rounded-xl shadow-sm border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-white">
                  สินค้าขายดี
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-600 duration-300 cursor-pointer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-white">{product.sales} ขาย</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        ฿{product.revenue.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {[
              {
                title: "เพิ่มสินค้าใหม่",
                icon: "mdi:plus-box",
                color: "bg-green-500 hover:bg-green-600",
                href: "/admin/product/create",
              },
              {
                title: "จัดการคำสั่งซื้อ",
                icon: "mdi:clipboard-text-outline",
                color: "bg-blue-500 hover:bg-blue-600",
                href: "/admin/order",
              },
              {
                title: "เพิ่มหมวดหมู่",
                icon: "mdi:chart-bar",
                color: "bg-purple-500 hover:bg-purple-600",
                href: "/admin/category",
              },
              {
                title: "ตั้งค่าระบบ",
                icon: "mdi:cog-outline",
                color: "bg-gray-500 hover:bg-gray-600",
                href: "/admin/settings",
              },
            ].map((action, index) => (
              <motion.button
                key={action.title}
                className={`${action.color} text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-colors`}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="flex flex-col items-center justify-center"
                >
                  <Icon icon={action.icon} className="text-4xl mb-3" />
                  <div className="text-base font-semibold">{action.title}</div>
                </Link>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
