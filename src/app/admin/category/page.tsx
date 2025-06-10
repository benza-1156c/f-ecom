"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Nav/Navbar";
import { api } from "@/lib/api";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SwalDelete } from "@/lib/Swal";
import toast from "react-hot-toast";
import AdminGuard from "@/lib/middleware/middleware";

const ManageCategoriesBrands = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]) as any;
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "",
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null) as any;
  const [brands, setBrands] = useState([]) as any;

  const [brandForm, setBrandForm] = useState({
    name: "",
    icon: "",
  });
  const [showBrandModal, setShowBrandModal] = useState(false);

  const handleCategorySubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        editingItem
          ? `${api}/admin/category/${editingItem.ID}`
          : `${api}/admin/category`,
        {
          method: editingItem ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(categoryForm),
        }
      );
      const data = await res.json();
      if (data.success) {
        setCategories((prev: any) => {
          if (editingItem) {
            return prev.map((cat: any) =>
              cat.ID === editingItem.ID ? data?.data : cat
            );
          } else {
            return [...prev, data?.data];
          }
        });
        setShowCategoryModal(false);
        setEditingItem(null);
        setCategoryForm({ name: "", icon: "" });
        toast.success(
          editingItem ? "แก้ไขหมวดหมู่สำเร็จ!" : "เพิ่มหมวดหมู่สำเร็จ!"
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const GetalCategorydata = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api}/category`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: any) => {
    setCategoryForm({
      name: category.Name,
      icon: category.Icon,
    });
    setEditingItem(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id: any) => {
    SwalDelete().then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${api}/admin/category/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          const data = await res.json();
          if (data.success) {
            setCategories((prev: any) =>
              prev.filter((cat: any) => cat.ID !== id)
            );
            toast.success("ลบหมวดหมู่สำเร็จ!");
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleBrandSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(editingItem ? `${api}/admin/brand/${editingItem.ID}` : `${api}/admin/brand`, {
        method: editingItem ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brandForm),
      });
      const data = await res.json();
      if (data.success) {
        setBrands((prev: any) => {
          if (editingItem) {
            return prev.map((brand: any) =>
              brand.ID === editingItem.ID ? data?.data : brand
            );
          } else {
            return [...prev, data?.data];
          }
        });
        setShowBrandModal(false);
        setBrandForm({ name: "", icon: "" });
        setEditingItem(null);
        toast.success(editingItem ? "แก้ไขแบรนด์สำเร็จ!" : "เพิ่มแบรนด์สำเร็จ!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBrand = (brand: any) => {
    setBrandForm({
      name: brand.Name,
      icon: brand.Icon,
    });
    setEditingItem(brand);
    setShowBrandModal(true);
  };

  const handleDeleteBrand = (id: any) => {
    SwalDelete().then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${api}/admin/brand/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          const data = await res.json();
          if (data.success) {
            setBrands((prev: any) => prev.filter((brand: any) => brand.ID !== id));
            toast.success("ลบแบรนด์สำเร็จ!");
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const GetalBranddata = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api}/brand`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setBrands(data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetalCategorydata();
    GetalBranddata();
  }, []);

  return (
    <>
      <AdminGuard />
      <Navbar />
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  จัดการหมวดหมู่และแบรนด์
                </h1>
                <p className="text-gray-400">
                  เพิ่ม แก้ไข และจัดการหมวดหมู่สินค้าและแบรนด์
                </p>
              </div>
              <motion.button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/admin">← กลับไปแดชบอร์ด</Link>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="flex space-x-1 bg-gray-800 p-1 rounded-xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === "categories"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              📂 หมวดหมู่สินค้า
            </button>
            <button
              onClick={() => setActiveTab("brands")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === "brands"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              📂 แบรนด์สินค้า
            </button>
          </motion.div>

          {activeTab === "categories" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  หมวดหมู่สินค้า ({categories.length})
                </h2>
                <motion.button
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + เพิ่มหมวดหมู่ใหม่
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.length > 0 &&
                  categories?.map((category: any, index: number) => (
                    <motion.div
                      key={category.ID}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Icon icon={category.Icon} />
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {category.Name}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => handleEditCategory(category)}
                          className="flex-1 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-800 text-blue-300 py-2 rounded-lg text-sm font-medium transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          แก้ไข
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteCategory(category.ID)}
                          className="flex-1 bg-red-900/50 hover:bg-red-900/70 border border-red-800 text-red-300 py-2 rounded-lg text-sm font-medium transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          ลบ
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {activeTab === "brands" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  แบรนด์สินค้า ({brands.length})
                </h2>
                <motion.button
                  onClick={() => setShowBrandModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + เพิ่มแบรนด์ใหม่
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand: any, index: any) => (
                  <motion.div
                    key={brand.ID}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Icon icon={brand.Icon} />
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {brand.Name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => handleEditBrand(brand)}
                        className="flex-1 bg-green-900/50 hover:bg-green-900/70 border border-green-800 text-green-300 py-2 rounded-lg text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        แก้ไข
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteBrand(brand.ID)}
                        className="flex-1 bg-red-900/50 hover:bg-red-900/70 border border-red-800 text-red-300 py-2 rounded-lg text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ลบ
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {showCategoryModal && (
            <motion.div
              className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold text-white mb-6">
                  {editingItem ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ชื่อหมวดหมู่ *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="เช่น อิเล็กทรอนิกส์"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ไอคอน (Emoji)
                    </label>
                    <input
                      type="text"
                      value={categoryForm.icon}
                      onChange={(e) =>
                        setCategoryForm((prev) => ({
                          ...prev,
                          icon: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="เช่น ic:twotone-phone"
                    />
                  </div>
                  <Link
                    className="text-blue-500 hover:underline"
                    href="https://icon-sets.iconify.design"
                    target="_blank"
                  >
                    ไอคอนจากนี่
                  </Link>
                </div>

                <div className="flex space-x-4 mt-6">
                  <motion.button
                    onClick={() => {
                      setShowCategoryModal(false);
                      setCategoryForm({ name: "", icon: "" });
                      setEditingItem(null);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ยกเลิก
                  </motion.button>
                  <motion.button
                    onClick={handleCategorySubmit}
                    disabled={loading || !categoryForm.name}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? "บันทึก..." : editingItem ? "อัปเดต" : "เพิ่ม"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showBrandModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold text-white mb-6">
                  {editingItem ? "แก้ไขแบรนด์" : "เพิ่มแบรนด์ใหม่"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ชื่อแบรนด์ *
                    </label>
                    <input
                      type="text"
                      value={brandForm.name}
                      onChange={(e) =>
                        setBrandForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="เช่น Apple"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Icon
                    </label>
                    <input
                      type="text"
                      value={brandForm.icon}
                      onChange={(e) =>
                        setBrandForm((prev) => ({
                          ...prev,
                          icon: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <motion.button
                    onClick={() => {
                      setShowBrandModal(false);
                      setBrandForm({
                        name: "",
                        icon: "",
                      });
                      setEditingItem(null);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ยกเลิก
                  </motion.button>
                  <motion.button
                    onClick={handleBrandSubmit}
                    disabled={loading || !brandForm.name}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? "บันทึก..." : editingItem ? "อัปเดต" : "เพิ่ม"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageCategoriesBrands;
