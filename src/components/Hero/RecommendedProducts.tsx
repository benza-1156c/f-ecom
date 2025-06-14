import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const RecommendedProducts = () => {
  const [products, setProducts] = useState([]);
  const [swiperRef, setSwiperRef] = useState(null) as any;
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  const GetProducts = async () => {
    try {
      const response = await fetch(`${api}/products-featured`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetProducts();
  }, []);

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const toggleAutoplay = () => {
    if (swiperRef) {
      if (autoplayEnabled) {
        swiperRef.autoplay.stop();
      } else {
        swiperRef.autoplay.start();
      }
      setAutoplayEnabled(!autoplayEnabled);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            สินค้าแนะนำ
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 ml-2">
              สำหรับคุณ
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            คัดสรรสินค้าคุณภาพดี ราคาพิเศษ เฉพาะสำหรับคุณ
          </p>
        </div>

        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-white">
                เลือกสรรมาเพื่อคุณ
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleAutoplay}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  autoplayEnabled
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-gray-600/20 text-gray-400 border border-gray-600/30"
                }`}
              >
                {autoplayEnabled ? "หยุด" : "เล่น"}
              </button>
            </div>
          </div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                prevEl: ".swiper-button-prev-custom",
                nextEl: ".swiper-button-next-custom",
              }}
              pagination={{
                clickable: true,
                renderBullet: (index, className) => {
                  return `<span class="${className} !bg-purple-500 !opacity-100"></span>`;
                },
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              loop={true}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              onSwiper={(swiper) => setSwiperRef(swiper)}
              className="!pb-12"
            >
              {products.map((product: any) => (
                <SwiperSlide key={product.ID}>
                  <div className="group relative bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl overflow-hidden border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-105 h-full">
                    {product.discount > 0 && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
                          <Tag size={12} />
                          <span>-{product.discount}%</span>
                        </div>
                      </div>
                    )}

                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={product.Images[0].Url}
                        alt={product.Name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Link
                      href={`/user/product/${product.ID}`}
                      className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                      <div>
                        <p className="text-purple-400 text-sm font-medium mb-1">
                          {product?.Categories.Name}
                        </p>
                        <h3 className="text-white font-bold text-lg line-clamp-2 leading-tight">
                          {product?.Name}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 text-sm">
                          {product?.rating} (
                          {product?.reviews?.toLocaleString()})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-white">
                              ฿{formatPrice(product?.Price)}
                            </span>
                            {product?.OriginalPrice > product?.Price && (
                              <span className="text-gray-500 line-through text-sm">
                                ฿{formatPrice(product?.OriginalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-700/80 hover:bg-gray-600/80 text-white p-3 rounded-xl transition-all duration-200 hover:scale-110 backdrop-blur-sm">
              <ChevronLeft size={20} />
            </button>
            <button className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-700/80 hover:bg-gray-600/80 text-white p-3 rounded-xl transition-all duration-200 hover:scale-110 backdrop-blur-sm">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105">
              ดูสินค้าทั้งหมด
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .swiper-pagination-bullet {
          background: #8b5cf6 !important;
          opacity: 0.5 !important;
          width: 12px !important;
          height: 12px !important;
        }
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
        .swiper-pagination {
          bottom: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default RecommendedProducts;
