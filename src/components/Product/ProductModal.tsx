import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";

export const ProductModal = ({ product, onClose,getCategoryName,getBrandName,formatPrice }:any) => {
  return (
    <motion.div
      className="fixed inset-0 backdrop:blur-2xl bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:flex">
          <div className="md:w-1/2 p-6">
            <img
              src={product?.Images[0]?.Url}
              alt={product?.Name}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{product?.Name}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2"
              >
                <Icon icon="ic:round-close" className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <span className="text-sm text-gray-400">
                {getCategoryName(product.CategoriesID)} •{" "}
                {getBrandName(product.BrandID)}
              </span>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
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
                <span className="text-sm text-gray-400 ml-2">
                  {product.Rating} ({product.Reviews} รีวิว)
                </span>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{product.Description}</p>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-white">
                ฿{formatPrice(product.Price)}
              </span>
              {product.OriginalPrice > product.Price && (
                <span className="text-lg text-gray-500 line-through">
                  ฿{formatPrice(product.OriginalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center mb-6">
              <Icon
                icon="ic:round-inventory"
                className="w-5 h-5 text-green-400 mr-2"
              />
              <span className="text-green-400">
                มีสินค้าในสต็อก {product.Count} ชิ้น
              </span>
            </div>

            <div className="space-y-3">
              <motion.button
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                เพิ่มลงตะกร้า
              </motion.button>
              <motion.button
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ซื้อทันที
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
