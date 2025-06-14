"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Nav/Navbar";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/app/AuthProvider";

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;
  const { user, setUser } = useAuth();

  const [product, setProduct] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
      fetchCategories();
      fetchBrands();
    }
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${api}/product/${productId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("ไม่พบสินค้าที่ต้องการ");
        }
        throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า");
      }

      const data = await response.json();
      setProduct(data.data);

      if (data.data?.CategoriesID) {
        fetchRelatedProducts(data.data.CategoriesID, data.data.ID);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${api}/category`);
      if (!response.ok) return;
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${api}/brand`);
      if (!response.ok) return;
      const data = await response.json();
      setBrands(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRelatedProducts = async (
    categoryId: number,
    currentProductId: number
  ) => {
    try {
      const response = await fetch(
        `${api}/product-related?category=${categoryId}&limit=8`
      );
      if (!response.ok) return;
      const data = await response.json();
      setRelatedProducts(
        data.data.filter((p: Product) => p.ID !== currentProductId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const getCategoryName = (categoryID: number) => {
    return categories.find((cat) => cat.ID === categoryID)?.Name || "ไม่ระบุ";
  };

  const getBrandName = (brandID: number) => {
    return brands.find((brand) => brand.ID === brandID)?.Name || "ไม่ระบุ";
  };

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`${api}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productid: Number(productId),
          quantity: quantity,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("เพิ่มสินค้าลงตะกร้าเรียบร้อย");
      } else {
        throw new Error("เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyNow = () => {
    if (!user?.ID) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      router.push("/login");
      return;
    }
    console.log(`Buying ${quantity} of product ${product?.ID}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Icon
              icon="ic:round-refresh"
              className="w-8 h-8 text-purple-500 animate-spin"
            />
            <span className="text-white text-lg">กำลังโหลดข้อมูลสินค้า...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Icon
              icon="ic:round-error"
              className="w-16 h-16 text-red-500 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-white mb-2">
              เกิดข้อผิดพลาด
            </h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              กลับหน้าก่อน
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900">
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => router.push("/")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                หน้าแรก
              </button>
              <Icon
                icon="ic:round-chevron-right"
                className="w-4 h-4 text-gray-600"
              />
              <button
                onClick={() => router.push("/user/product")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                สินค้าทั้งหมด
              </button>
              <Icon
                icon="ic:round-chevron-right"
                className="w-4 h-4 text-gray-600"
              />
              <span className="text-white">{product.Name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <motion.div
                className="relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowImageModal(true)}
              >
                <img
                  src={product?.Images[selectedImageIndex]?.Url}
                  alt={product?.Name}
                  className="w-full h-full object-cover"
                />
                {product?.OriginalPrice > product?.Price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
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
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    เหลือน้อย
                  </div>
                )}
              </motion.div>

              {product?.Images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product?.Images.map((image: any, index: any) => (
                    <motion.button
                      key={image.ID}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index
                          ? "border-purple-500"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image.Url}
                        alt={`${product.Name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {product.Name}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>{getCategoryName(product.CategoriesID)}</span>
                  <span>•</span>
                  <span>{getBrandName(product.BrandID)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      icon="ic:round-star"
                      className={`w-5 h-5 ${
                        i < Math.floor(product.Rating)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white font-medium">
                  {/* {product.Rating.toFixed(1)} */}
                </span>
                <span className="text-gray-400">({product.Reviews} รีวิว)</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-white">
                    ฿{formatPrice(product.Price)}
                  </span>
                  {product.OriginalPrice > product.Price && (
                    <span className="text-lg text-gray-500 line-through">
                      ฿{formatPrice(product.OriginalPrice)}
                    </span>
                  )}
                </div>
                {product.OriginalPrice > product.Price && (
                  <div className="text-green-400 text-sm">
                    ประหยัด ฿
                    {formatPrice(product.OriginalPrice - product.Price)}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Icon
                  icon="ic:round-inventory"
                  className={`w-5 h-5 ${
                    product.Count > 0 ? "text-green-400" : "text-red-400"
                  }`}
                />
                <span
                  className={
                    product.Count > 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  {product.Count > 0
                    ? `มีสินค้าในสต็อก (${product.Count} ชิ้น)`
                    : "สินค้าหมด"}
                </span>
              </div>

              {product.Count > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    จำนวน
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-gray-700 hover:bg-gray-600 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Icon icon="ic:round-remove" className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.Count}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(
                            product.Count,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        )
                      }
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-center text-white w-20"
                    />
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.Count, quantity + 1))
                      }
                      className="bg-gray-700 hover:bg-gray-600 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                      disabled={quantity >= product.Count}
                    >
                      <Icon icon="ic:round-add" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <motion.button
                  onClick={handleBuyNow}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.Count === 0}
                  whileTap={{ scale: 0.98 }}
                >
                  ซื้อเลย
                </motion.button>
                {user?.ID ? (
                  <motion.button
                    onClick={handleAddToCart}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    disabled={product.Count === 0}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon icon="ic:round-shopping-cart" className="w-5 h-5" />
                    <span>เพิ่มลงตะกร้า</span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => router.push("/login")}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon icon="ic:round-login" className="w-5 h-5" />
                    <span>เข้าสู่ระบบเพื่อเพิ่มลงตะกร้า</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8">
                {[
                  {
                    id: "description",
                    label: "คำอธิบาย",
                    icon: "ic:round-description",
                  },
                  {
                    id: "specifications",
                    label: "รายละเอียด",
                    icon: "ic:round-list-alt",
                  },
                  {
                    id: "reviews",
                    label: "รีวิว",
                    icon: "ic:round-rate-review",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-purple-500 text-purple-400"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon icon={tab.icon} className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="prose prose-invert max-w-none"
                  >
                    <div className="text-gray-300 whitespace-pre-line">
                      {product.Description || "ไม่มีรายละเอียดสินค้า"}
                    </div>
                    {product.Features && product.Features.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-xl font-semibold text-white mb-4">
                          คุณสมบัติเด่น
                        </h3>
                        <ul className="space-y-2">
                          {product.Features.map((feature: any, index: any) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2 text-gray-300"
                            >
                              <Icon
                                icon="ic:round-check-circle"
                                className="w-5 h-5 text-green-400 mt-0.5"
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "specifications" && (
                  <motion.div
                    key="specifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {product.Specifications &&
                    Object.keys(product.Specifications).length > 0 ? (
                      <div className="bg-gray-800 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(product.Specifications).map(
                            ([key, value]: any) => (
                              <div
                                key={key}
                                className="flex justify-between py-2 border-b border-gray-700"
                              >
                                <span className="text-gray-400">{key}</span>
                                <span className="text-white font-medium">
                                  {value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        ไม่มีรายละเอียดทางเทคนิค
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div
                          key={review.ID}
                          className="bg-gray-800 rounded-xl p-6"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-white font-medium">
                                {review.UserName}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Icon
                                      key={i}
                                      icon="ic:round-star"
                                      className={`w-4 h-4 ${
                                        i < review.Rating
                                          ? "text-yellow-400"
                                          : "text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-400">
                                  {review.Date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-4">{review.Comment}</p>
                          {review.Images && review.Images.length > 0 && (
                            <div className="flex space-x-2">
                              {review.Images.map((image: any, index: any) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`รีวิว ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        ยังไม่มีรีวิวสำหรับสินค้านี้
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-8">
                สินค้าที่เกี่ยวข้อง
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <motion.div
                    key={relatedProduct.ID}
                    className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden  hover:border-purple-500 transition-all cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() =>
                      router.push(`/user/product/${relatedProduct.ID}`)
                    }
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={relatedProduct?.Images[0]?.Url}
                        alt={relatedProduct.Name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">
                        {relatedProduct.Name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">
                          ฿{formatPrice(relatedProduct.Price)}
                        </span>
                        <div className="flex items-center">
                          <Icon
                            icon="ic:round-star"
                            className="w-4 h-4 text-yellow-400"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showImageModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImageModal(false)}
            >
              <motion.div
                className="relative max-w-4xl max-h-full"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors z-10"
                >
                  <Icon icon="ic:round-close" className="w-6 h-6" />
                </button>
                <img
                  src={product.Images[selectedImageIndex]?.Url}
                  alt={product.Name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProductDetailPage;
