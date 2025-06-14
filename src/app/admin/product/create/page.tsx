"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Nav/Navbar";
import AdminGuard from "@/lib/middleware/middleware";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import Link from "next/link";

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
    brand: "",
    status: "active",
    featured: false,
    sku: "",
  });

  const [imagePreview, setImagePreview] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]) as any;
  const [brands, setBrands] = useState([]) as any;
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("dimensions.")) {
      const dimension = name.split(".")[1];
      setFormData((prev: any) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimension]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    setFormData((prev: any) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prev: any) => [...prev, ...previewUrls]);

    e.target.value = "";
  };

  const removeImage = (index: any) => {
    setImagePreview((prev: any) =>
      prev.filter((_: any, i: any) => i !== index)
    );
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, i: any) => i !== index),
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price.toString());
    form.append("category", formData.category.toString());
    form.append("brand", formData.brand.toString());
    form.append("stock", formData.stock.toString());
    form.append("status", formData.status.toString());
    form.append("featured", formData.featured ? "true" : "false");
    form.append("sku", formData.sku.toString());

    formData.images.forEach((file: File) => {
      form.append("images", file);
    });

    try {
      const res = await fetch(`${api}/admin/product`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("เพิ่มสินค้าสำเร็จ!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const GetCategories = async () => {
    try {
      const res = await fetch(`${api}/category`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetBrands = async () => {
    try {
      const res = await fetch(`${api}/brand`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetCategories();
    GetBrands();
  }, []);

  return (
    <>
      <AdminGuard />
      <Navbar />
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  เพิ่มสินค้าใหม่
                </h1>
                <p className="text-gray-400">
                  กรอกข้อมูลสินค้าใหม่เพื่อเพิ่มเข้าสู่ระบบ
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

          <div className="space-y-6">
            <motion.div
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">📦</span>
                ข้อมูลพื้นฐาน
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ชื่อสินค้า *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    คำอธิบายสินค้า
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="อธิบายรายละเอียดสินค้า..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    หมวดหมู่ *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((category: any) => (
                      <option key={category.ID} value={category.ID}>
                        {category.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    แบรนด์ *
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">เลือกแบรนด์</option>
                    {brands.map((brand: any) => (
                      <option key={brand.ID} value={brand.ID}>
                        {brand.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">💰</span>
                ราคาและสต็อก
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ราคาขาย (บาท) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    จำนวนสต็อก *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">🖼️</span>
                รูปภาพสินค้า
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">คลิกเพื่ออัพโหลด</span>{" "}
                        หรือลากไฟล์มาวาง
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG (สูงสุด 10MB)
                      </p>
                    </div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreview.map((image: any, index: any) => (
                      <motion.div
                        key={index}
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">⚙️</span>
                การตั้งค่าเพิ่มเติม
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      สถานะสินค้า
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="active">เปิดขาย</option>
                      <option value="inactive">ปิดขาย</option>
                      <option value="draft">ร่าง</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <label className="ml-3 text-sm font-medium text-gray-300">
                      แสดงในหน้าแรก (สินค้าแนะนำ)
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="button"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                บันทึกร่าง
              </motion.button>

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    กำลังบันทึก...
                  </>
                ) : (
                  "เพิ่มสินค้า"
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductPage;
