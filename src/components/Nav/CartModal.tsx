import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";

const CartModal = ({ isCartOpen, setIsCartOpen }: any) => {
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const [cartCount] = useState(3);

  const [cartItems] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 45000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "MacBook Air M2",
      price: 42000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "AirPods Pro",
      price: 8900,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop",
    },
  ]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />

          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-xl z-50 border-l border-gray-800"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">
                ตะกร้าสินค้า ({cartCount})
              </h2>
              <motion.button
                onClick={toggleCart}
                className="text-gray-400 hover:text-white p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon icon="mdi:close" width="24" height="24" />
              </motion.button>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex items-center space-x-4 bg-gray-800 rounded-lg p-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      ฿{item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <motion.button
                        className="w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        -
                      </motion.button>
                      <span className="text-white text-sm w-8 text-center">
                        {item.quantity}
                      </span>
                      <motion.button
                        className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                  <motion.button
                    className="text-gray-400 hover:text-red-400 p-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon icon="mdi:delete" width="24" height="24" />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-gray-800 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">รวมทั้งหมด:</span>
                <span className="text-2xl font-bold text-white">
                  ฿{totalPrice.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <motion.button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ชำระเงิน
                </motion.button>
                <motion.button
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ดูตะกร้าสินค้า
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
