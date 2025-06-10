"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const ProductDisplay = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceRange: "",
    sortBy: "name",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const observerRef = useRef<any>(null);
  const [categories, setCategories] = useState([]) as any;
  const [brands, setBrands] = useState([]) as any;

  const fetchProducts = useCallback(
    async (pageNum: number, isNewSearch = false) => {
      setLoading(true);
      const query = new URLSearchParams({
        page: pageNum.toString(),
        limit: "12",
        search: searchTerm,
        category: filters.category,
        brand: filters.brand,
        priceRange: filters.priceRange,
        sortBy: filters.sortBy,
      }).toString();

      try {
        const res = await fetch(`${api}/admin/product?${query}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          if (isNewSearch) {
            setProducts(data.data);
          } else {
            setProducts((prev: any[]) => [...prev, ...data.data]);
          }

          setHasMore(data.data.length === 12);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [filters, searchTerm]
  );

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

  const lastProductElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchProducts(1, true);
  }, [filters, searchTerm]);

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, false);
    }
  }, [page]);

  const handleFilterChange = (filterType: any, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setPage(1);
    setHasMore(true);
  };

  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
  };

  useEffect(() => {
    GetCategories();
    GetBrands();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                สินค้าทั้งหมด
              </h1>
              <p className="text-gray-400">
                ค้นหาและเลือกซื้อสินค้าที่คุณต้องการ
              </p>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="ค้นหาสินค้า..."
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            className="lg:w-80 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="text-xl mr-2">🎛️</span>
                ตัวกรอง
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    หมวดหมู่
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">ทั้งหมด</option>
                    {categories.map((category: any) => (
                      <option key={category.ID} value={category.Name}>
                        {category.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    แบรนด์
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) =>
                      handleFilterChange("brand", e.target.value)
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">ทั้งหมด</option>
                    {brands.map((brand: any) => (
                      <option key={brand.ID} value={brand.Name}>
                        {brand.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ช่วงราคา
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) =>
                      handleFilterChange("priceRange", e.target.value)
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">ทั้งหมด</option>
                    <option value="0-10000">0 - 10,000 บาท</option>
                    <option value="10000-25000">10,000 - 25,000 บาท</option>
                    <option value="25000-50000">25,000 - 50,000 บาท</option>
                    <option value="50000+">50,000+ บาท</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    เรียงตาม
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="name">ชื่อสินค้า</option>
                    <option value="price-low">ราคา: ต่ำ → สูง</option>
                    <option value="price-high">ราคา: สูง → ต่ำ</option>
                    <option value="rating">คะแนนรีวิว</option>
                    <option value="newest">สินค้าใหม่</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex-1">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence>
                {products.map((product: any, index: any) => (
                  <motion.div
                    key={product.ID}
                    ref={
                      index === products.length - 1
                        ? lastProductElementRef
                        : null
                    }
                    className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative overflow-hidden">
                      {product?.Images?.length > 0 ? (
                        <img
                          src={product.Images[0].Url}
                          alt={product.Name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <img
                          src="/placeholder.png"
                          alt={product.Name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      {product.featured && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          แนะนำ
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-purple-400 font-medium">
                          {product.Brand?.Name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {product.Category?.Name}
                        </span>
                      </div>

                      <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {product.Name}
                      </h3>

                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(product.rating) ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-400 text-xs ml-2">
                          ({product.reviews})
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-xl font-bold text-white">
                            ฿{product.Price.toLocaleString()}
                          </div>
                          {/* <div className="text-sm text-gray-500 line-through">
                            ฿{product.OriginalPrice.toLocaleString()}
                          </div> */}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">คงเหลือ</div>
                          <div className="text-sm font-semibold text-green-400">
                            {product?.Count} ชิ้น
                          </div>
                        </div>
                      </div>

                      <motion.button
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          router.push(`/admin/product/${product.ID}`);
                        }}
                      >
                        แก้ไข
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Loading Indicator */}
            {loading && (
              <motion.div
                className="flex justify-center items-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-center space-x-4">
                  <motion.div
                    className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="text-white font-medium">
                    กำลังโหลดสินค้าเพิ่มเติม...
                  </span>
                </div>
              </motion.div>
            )}

            {/* End of Products */}
            {!hasMore && products.length > 0 && (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <span className="text-gray-400">
                    🎉 คุณได้ดูสินค้าครบทุกรายการแล้ว
                  </span>
                </div>
              </motion.div>
            )}

            {/* No Products */}
            {!loading && products.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    ไม่พบสินค้า
                  </h3>
                  <p className="text-gray-400">
                    ลองเปลี่ยนเงื่อนไขการค้นหาใหม่
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
