"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Nav/Navbar";
import { ProductModal } from "@/components/Product/ProductModal";
import { api } from "@/lib/api";

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${api}/category`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${api}/brand`);
      if (!response.ok) throw new Error("Failed to fetch brands");
      const data = await response.json();
      setBrands(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async (page = 1, reset = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        search: searchTerm,
        category: selectedCategory !== "all" ? selectedCategory : "",
        brand: selectedBrand !== "all" ? selectedBrand : "",
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
      });

      const response = await fetch(`${api}/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();

      if (reset || page === 1) {
        setProducts(data.data);
      } else {
        setProducts((prev) => [...prev, ...data.data]);
      }

      setTotal(data?.total);
      setHasMore(data?.hasMore);
      setCurrentPage(data?.currentPage);
    } catch (error) {
      console.error(error);
      setError("เกิดข้อผิดพลาดในการโหลดสินค้า กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreProducts = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchProducts(currentPage + 1);
    }
  }, [loading, loadingMore, hasMore, currentPage]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts(1, true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1, true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const getCategoryName = (categoryID: number) => {
    return categories.find((cat) => cat.ID === categoryID)?.Name || "ไม่ระบุ";
  };

  const getBrandName = (brandID: number) => {
    return brands.find((brand) => brand.ID === brandID)?.Name || "ไม่ระบุ";
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange([0, 100000]);
    setSearchTerm("");
    setSortBy("name");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900">
        <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">สินค้าทั้งหมด</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Icon
                    icon="ic:round-search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <input
                    type="text"
                    placeholder="ค้นหาสินค้า..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Icon icon="ic:round-filter-list" className="w-5 h-5" />
                  <span>ตัวกรอง</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="lg:w-80 bg-gray-800 border border-gray-700 rounded-xl p-6 h-fit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">
                    ตัวกรอง
                  </h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      หมวดหมู่
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="all">ทั้งหมด</option>
                      {categories.map((category) => (
                        <option key={category.ID} value={category.ID}>
                          {category.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      แบรนด์
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="all">ทั้งหมด</option>
                      {brands.map((brand) => (
                        <option key={brand.ID} value={brand.ID}>
                          {brand.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ช่วงราคา: ฿{formatPrice(priceRange[0])} - ฿
                      {formatPrice(priceRange[1])}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            parseInt(e.target.value),
                            priceRange[1],
                          ])
                        }
                        className="w-full accent-purple-500"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={resetFilters}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                  >
                    รีเซ็ตตัวกรอง
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400">
                  {loading
                    ? "กำลังโหลด..."
                    : `พบสินค้า ${total.toLocaleString()} รายการ`}
                </p>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    disabled={loading}
                  >
                    <option value="name">เรียงตามชื่อ</option>
                    <option value="price-low">ราคาต่ำ - สูง</option>
                    <option value="price-high">ราคาสูง - ต่ำ</option>
                    <option value="rating">คะแนนสูงสุด</option>
                    <option value="newest">ใหม่ล่าสุด</option>
                  </select>

                  <div className="flex border border-gray-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      <Icon icon="ic:round-grid-view" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      <Icon icon="ic:round-list" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Icon
                      icon="ic:round-error"
                      className="w-5 h-5 text-red-500"
                    />
                    <p className="text-red-400">{error}</p>
                  </div>
                  <button
                    onClick={() => fetchProducts(1, true)}
                    className="mt-2 text-sm text-purple-400 hover:text-purple-300 underline"
                  >
                    ลองใหม่
                  </button>
                </div>
              )}

              {loading && products.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(12)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden animate-pulse"
                    >
                      <div className="h-48 bg-gray-700"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <Icon
                    icon="ic:round-search-off"
                    className="w-16 h-16 text-gray-600 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    ไม่พบสินค้า
                  </h3>
                  <p className="text-gray-500">
                    ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่
                  </p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {products.map((product: any, index: any) => (
                    <motion.div
                      key={product.ID}
                      ref={
                        index === products.length - 1
                          ? lastProductElementRef
                          : null
                      }
                      className={
                        viewMode === "grid"
                          ? "bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all cursor-pointer"
                          : "bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-purple-500 transition-all cursor-pointer flex items-center space-x-4"
                      }
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: viewMode === "grid" ? 1.02 : 1.005 }}
                      onClick={() => setSelectedProduct(product)}
                    >
                      {viewMode === "grid" ? (
                        <>
                          <div className="relative">
                            <img
                              src={product?.Images[0]?.Url}
                              alt={product.Name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {product.OriginalPrice > product.Price && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                ลด{" "}
                                {Math.round(
                                  ((product.OriginalPrice - product.Price) /
                                    product.OriginalPrice) *
                                    100
                                )}
                                %
                              </div>
                            )}
                            {product.Count < 10 && (
                              <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                                เหลือน้อย
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-white mb-2 line-clamp-2">
                              {product.Name}
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">
                              {getCategoryName(product.CategoriesID)} •{" "}
                              {getBrandName(product.BrandID)}
                            </p>
                            <div className="flex items-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Icon
                                  key={i}
                                  icon="ic:round-star"
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.Rating)
                                      ? "text-yellow-400"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-400 ml-1">
                                ({product.Reviews})
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-white">
                                  ฿{formatPrice(product.Price)}
                                </span>
                                {product.OriginalPrice > product.Price && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ฿{formatPrice(product.OriginalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={product?.Images[0]?.Url}
                            alt={product.Name}
                            className="w-24 h-24 object-cover rounded-lg"
                            loading="lazy"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">
                              {product.Name}
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">
                              {getCategoryName(product.CategoriesID)} •{" "}
                              {getBrandName(product.BrandID)}
                            </p>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Icon
                                  key={i}
                                  icon="ic:round-star"
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.Rating)
                                      ? "text-yellow-400"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-400 ml-1">
                                ({product.Reviews})
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-white">
                                  ฿{formatPrice(product.Price)}
                                </span>
                                {product.OriginalPrice > product.Price && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ฿{formatPrice(product.OriginalPrice)}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-400">
                                คงเหลือ {product.Count} ชิ้น
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {loadingMore && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Icon
                      icon="ic:round-refresh"
                      className="w-5 h-5 animate-spin"
                    />
                    <span>กำลังโหลดสินค้าเพิ่มเติม...</span>
                  </div>
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">แสดงสินค้าครบทุกรายการแล้ว</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              getCategoryName={getCategoryName}
              getBrandName={getBrandName}
              formatPrice={formatPrice}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProductPage;
