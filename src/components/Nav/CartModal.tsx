import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from "@/app/AuthProvider";

const CartModal = ({ isCartOpen, setIsCartOpen }: any) => {
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const { user } = useAuth();

  const cartItems = user?.Cart?.CartItems || [];
  const cartCount = cartItems.length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const totalPrice = cartItems.reduce(
    (sum: number, item: any) => sum + item.Product.Price * item.Quantity,
    0
  );

  const updateQuantity = (cartItemId: number, newQuantity: number) => {
    console.log(`Update item ${cartItemId} to quantity ${newQuantity}`);
  };

  const removeFromCart = (cartItemId: number) => {
    console.log(`Remove item ${cartItemId} from cart`);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 z-50"
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
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Icon
                    icon="mdi:cart-outline"
                    width="64"
                    height="64"
                    className="mb-4"
                  />
                  <p className="text-lg">ตะกร้าสินค้าว่างเปล่า</p>
                  <p className="text-sm">
                    เพิ่มสินค้าลงในตะกร้าเพื่อเริ่มช้อปปิ้ง
                  </p>
                </div>
              ) : (
                cartItems.map((item: any, index: number) => (
                  <motion.div
                    key={item.ID}
                    className="flex items-center space-x-4 bg-gray-800 rounded-lg p-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img
                      src={
                        item.Product.Images[0]?.Url || "/placeholder-image.jpg"
                      }
                      alt={item.Product.Name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm line-clamp-2">
                        {item.Product.Name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        ฿{formatPrice(item.Product.Price)}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <motion.button
                          className="w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            updateQuantity(
                              item.ID,
                              Math.max(1, item.Quantity - 1)
                            )
                          }
                          disabled={item.Quantity <= 1}
                        >
                          -
                        </motion.button>
                        <span className="text-white text-sm w-8 text-center">
                          {item.Quantity}
                        </span>
                        <motion.button
                          className="w-6 h-6 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            updateQuantity(item.ID, item.Quantity + 1)
                          }
                        >
                          +
                        </motion.button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        รวม: ฿{formatPrice(item.Product.Price * item.Quantity)}
                      </div>
                    </div>
                    <motion.button
                      className="text-gray-400 hover:text-red-400 p-1 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.ID)}
                    >
                      <Icon icon="mdi:delete" width="20" height="20" />
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-800 p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">รวมทั้งหมด:</span>
                  <span className="text-2xl font-bold text-white">
                    ฿{formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="space-y-2">
                  <motion.button
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ดำเนินการชำระเงิน
                  </motion.button>
                  <motion.button
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleCart}
                  >
                    ดูตะกร้าสินค้า
                  </motion.button>
                </div>
              </div>
            )}

            {user && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-gray-800/50 rounded-lg p-2 flex items-center space-x-2">
                  <img
                    src={user.Avatar}
                    alt={user.UserName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {user.UserName}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {user.Email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
