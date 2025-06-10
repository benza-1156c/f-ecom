"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Nav/Navbar";
import AdminGuard from "@/lib/middleware/middleware";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

const UsersListPage = () => {
  const [users, setUsers] = useState([]) as any;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage] = useState(10);

  const GetUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: usersPerPage.toString(),
        search: searchTerm,
        role: filterRole === "all" ? "" : filterRole,
      });

      const res = await fetch(`${api}/admin/users?${params}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        setTotalUsers(data.total);
      }
    } catch (error) {
      console.log(error);
      toast.error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: any, currentStatus: any) => {
    try {
      const newStatus = currentStatus === "active" ? "closed" : "active";
      const res = await fetch(`${api}/admin/users/status/${userId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(
          `${newStatus === "active" ? "เปิดใช้งาน" : "ปิดใช้งาน"}ผู้ใช้สำเร็จ`
        );
        setUsers((prev: any) =>
          prev.map((user: any) =>
            user.ID === userId ? { ...user, Status: newStatus } : user
          )
        );
      } else {
        toast.error(data.message || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.log(error);
      toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
    }
  };

  console.log(users);

  const deleteUser = async (userId: any, userName: any) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่ต้องการลบผู้ใช้ "${userName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${api}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("ลบผู้ใช้สำเร็จ");
        GetUsers();
      } else {
        toast.error(data.message || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.log(error);
      toast.error("เกิดข้อผิดพลาดในการลบผู้ใช้");
    }
  };

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.Role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    GetUsers();
  }, [currentPage, searchTerm, filterRole, filterStatus]);

  return (
    <>
      <AdminGuard />
      <Navbar />
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  จัดการผู้ใช้งาน
                </h1>
                <p className="text-gray-400">
                  ดูและจัดการข้อมูลผู้ใช้งานในระบบ
                </p>
              </div>
              <motion.button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/admin">← กลับแดชบอร์ด</Link>
              </motion.button>
            </div>
          </motion.div>

          {/* สถิติ */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">ผู้ใช้ทั้งหมด</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">ผู้ดูแลระบบ</p>
                  <p className="text-2xl font-bold">
                    {users.filter((u: any) => u.role === "admin").length}
                  </p>
                </div>
                <div className="text-3xl">👑</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">ลูกค้าทั่วไป</p>
                  <p className="text-2xl font-bold">
                    {users.filter((u: any) => u.role === "customer").length}
                  </p>
                </div>
                <div className="text-3xl">🛍️</div>
              </div>
            </div>
          </motion.div>

          {/* ตัวกรองและค้นหา */}
          <motion.div
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ค้นหา
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ชื่อหรืออีเมล..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  บทบาท
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                  <option value="user">ลูกค้า</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterRole("all");
                    setFilterStatus("all");
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  ล้างตัวกรong
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-gray-400">กำลังโหลด...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        ผู้ใช้
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        บทบาท
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        สถานะ
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        วันที่สมัคร
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        การจัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredUsers.map((user: any, index: any) => (
                      <motion.tr
                        key={user.ID || index}
                        className="hover:bg-gray-700/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Image
                                src={user.Avatar || "/default-user.png"}
                                alt={user.UserName || "ไม่ระบุชื่อ"}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {user.UserName || "ไม่ระบุชื่อ"}
                              </div>
                              <div className="text-sm text-gray-400">
                                {user.Email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.Role === "admin"
                                ? "bg-red-100 text-red-800"
                                : user.Role === "user"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.Role === "admin"
                              ? "👑 ผู้ดูแลระบบ"
                              : user.Role === "user"
                              ? "🛡️ ผู้ใช้"
                              : "🛍️ ลูกค้า"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.Status === "active"
                                ? "bg-green-100 text-green-800"
                                : user.Status === "closed"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.Status === "active"
                              ? "✅ เปิดใช้งาน"
                              : user.Status === "closed"
                              ? "❌ ถูกปิดใช้งาน"
                              : "ปิดใช้งาน"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.CreatedAt ? formatDate(user.CreatedAt) : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <motion.button
                              onClick={() =>
                                toggleUserStatus(user.ID, user.Status)
                              }
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                user.Status === "active"
                                  ? "bg-red-600 hover:bg-red-700 text-white"
                                  : "bg-green-600 hover:bg-green-700 text-white"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {user.Status === "active"
                                ? "ปิดใช้งาน"
                                : "เปิดใช้งาน"}
                            </motion.button>

                            <Link href={`/admin/users/${user.ID}`}>
                              <motion.button
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                ดูรายละเอียด
                              </motion.button>
                            </Link>

                            {user.Role !== "admin" && (
                              <motion.button
                                onClick={() => deleteUser(user.id, user.name)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                ลบ
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-gray-400 text-lg">ไม่พบผู้ใช้</p>
                    <p className="text-gray-500 text-sm mt-2">
                      ลองเปลี่ยนเงื่อนไขการค้นหาดู
                    </p>
                  </div>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <div className="bg-gray-700 px-6 py-3 flex items-center justify-between border-t border-gray-600">
                <div className="text-sm text-gray-400">
                  แสดง {(currentPage - 1) * usersPerPage + 1} -{" "}
                  {Math.min(currentPage * usersPerPage, totalUsers)} จาก{" "}
                  {totalUsers}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                  >
                    ก่อนหน้า
                  </button>

                  <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            currentPage === page
                              ? "bg-purple-600 text-white"
                              : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default UsersListPage;
