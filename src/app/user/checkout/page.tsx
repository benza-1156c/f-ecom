"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  ArrowLeft,
  Plus,
  Minus,
  Trash,
} from "lucide-react";
import { useAuth } from "@/app/AuthProvider";
import Navbar from "@/components/Nav/Navbar";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [qrCode, setQrCode] = useState("");

  const router = useRouter();

  const cartItems = user?.Cart?.CartItems || [];
  const userAddresses = user?.Address || [];

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const defaultAddress = userAddresses.find((addr: any) => addr.IsDefault);
    return defaultAddress ? defaultAddress.ID : userAddresses[0]?.ID || null;
  });

  const selectedAddress = userAddresses.find(
    (addr: any) => addr.ID === selectedAddressId
  );

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const subtotal = cartItems.reduce(
    (sum: any, item: any) => sum + item.Product?.Price * item.Quantity,
    0
  );
  const shipping = shippingMethod === "express" ? 150 : 50;
  const total = subtotal + shipping;

  const steps = [
    { id: 1, title: "ข้อมูลการจัดส่ง", icon: MapPin },
    { id: 2, title: "วิธีการชำระเงิน", icon: CreditCard },
    { id: 3, title: "ยืนยันคำสั่งซื้อ", icon: CheckCircle },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      if (!selectedAddress) {
        toast.error("กรุณาเลือกที่อยู่จัดส่ง");
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenQrCode = async () => {
    try {
      const res = await fetch(`${api}/payment/promptpay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: String(total),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQrCode(data.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = async (productId: any, newQuantity: any) => {
    if (newQuantity < 1) {
      toast.error("จำนวนสินค้าต้องมากกว่า 1");
      return;
    }
    try {
      const res = await fetch(`${api}/cart/update`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: user?.Cart?.ID,
          quantity: newQuantity,
          productId: productId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUser((prev: any) => ({
          ...prev,
          Cart: {
            ...(prev.Cart || {}),
            CartItems: prev.Cart.CartItems.map((item: any) => {
              if (item.Product.ID === productId) {
                return {
                  ...item,
                  Quantity: newQuantity,
                };
              }
              return item;
            }),
          },
        }));
        toast.success("อัปเดตจำนวนสินค้าสำเร็จ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (cartItemId: any) => {
    console.log(cartItemId);
    try {
      const res = await fetch(`${api}/cart/remove/${cartItemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUser((prev: any) => ({
          ...prev,
          Cart: {
            ...(prev.Cart || {}),
            CartItems: prev.Cart.CartItems.filter(
              (item: any) => item.ID !== cartItemId
            ),
          },
        }));
        toast.success("ลบสินค้าออกจากตะกร้าสำเร็จ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              ดำเนินการชำระเงิน
            </h1>
            <p className="text-gray-300">กรอกข้อมูลเพื่อสั่งซื้อสินค้า</p>
          </motion.div>

          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                          : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 text-gray-400"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={20} />
                    </motion.div>
                    <div className="ml-3 hidden md:block">
                      <p
                        className={`text-sm font-medium ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-16 h-0.5 bg-gray-700 mx-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <MapPin className="mr-3 text-purple-400" />
                      ข้อมูลการจัดส่ง
                    </h2>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          เลือกที่อยู่จัดส่ง
                        </h3>
                      </div>

                      {userAddresses.length > 0 && (
                        <div className="space-y-3">
                          {userAddresses.map((address: any) => (
                            <motion.label
                              key={address.ID}
                              className={`flex items-start p-4 rounded-lg cursor-pointer transition-all ${
                                selectedAddressId === address.ID
                                  ? "bg-purple-600/20 border-purple-500"
                                  : "bg-gray-700/50 border-gray-600"
                              } border-2`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <input
                                type="radio"
                                name="address"
                                value={address.ID}
                                checked={selectedAddressId === address.ID}
                                onChange={(e) =>
                                  setSelectedAddressId(parseInt(e.target.value))
                                }
                                className="sr-only"
                              />
                              <MapPin
                                className="text-purple-400 mr-3 mt-1 flex-shrink-0"
                                size={20}
                              />
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <p className="text-white font-medium">
                                    {address.RecipientName}
                                  </p>
                                  {address.IsDefault && (
                                    <span className="ml-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                                      ที่อยู่หลัก
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-300 text-sm">
                                  {address.Phone}
                                </p>
                                <p className="text-gray-300 text-sm">
                                  {address.Address}, {address.Other}
                                </p>
                                <p className="text-gray-300 text-sm">
                                  {address.SubDistrict} {address.District}{" "}
                                  {address.Province} {address.PostalCode}
                                </p>
                              </div>
                            </motion.label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        วิธีการจัดส่ง
                      </h3>
                      <div className="space-y-3">
                        <motion.label
                          className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                            shippingMethod === "standard"
                              ? "bg-purple-600/20 border-purple-500"
                              : "bg-gray-700/50 border-gray-600"
                          } border-2`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value="standard"
                            checked={shippingMethod === "standard"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="sr-only"
                          />
                          <Truck className="text-purple-400 mr-3" size={20} />
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              จัดส่งมาตรฐาน
                            </p>
                            <p className="text-gray-400 text-sm">
                              5-7 วันทำการ
                            </p>
                          </div>
                          <span className="text-white font-semibold">฿50</span>
                        </motion.label>

                        <motion.label
                          className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                            shippingMethod === "express"
                              ? "bg-purple-600/20 border-purple-500"
                              : "bg-gray-700/50 border-gray-600"
                          } border-2`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value="express"
                            checked={shippingMethod === "express"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="sr-only"
                          />
                          <Truck className="text-purple-400 mr-3" size={20} />
                          <div className="flex-1">
                            <p className="text-white font-medium">จัดส่งด่วน</p>
                            <p className="text-gray-400 text-sm">
                              1-2 วันทำการ
                            </p>
                          </div>
                          <span className="text-white font-semibold">฿150</span>
                        </motion.label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <CreditCard className="mr-3 text-purple-400" />
                      วิธีการชำระเงิน
                    </h2>

                    <div className="space-y-4">
                      <motion.label
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "credit"
                            ? "bg-purple-600/20 border-purple-500"
                            : "bg-gray-700/50 border-gray-600"
                        } border-2`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="credit"
                          checked={paymentMethod === "credit"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <CreditCard
                          className="text-purple-400 mr-3"
                          size={20}
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            บัตรเครดิต/เดบิต
                          </p>
                          <p className="text-gray-400 text-sm">
                            Visa, Mastercard, JCB
                          </p>
                        </div>
                      </motion.label>

                      <motion.label
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === "promptpay"
                            ? "bg-purple-600/20 border-purple-500"
                            : "bg-gray-700/50 border-gray-600"
                        } border-2`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          onClick={handleGenQrCode}
                          name="payment"
                          value="promptpay"
                          checked={paymentMethod === "promptpay"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <img
                          src="https://download-th.com/wp-content/uploads/2023/02/PromptPay.jpg"
                          alt="PromptPay"
                          className="w-16 h-16 bg-blue-500 rounded mr-3"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">PromptPay</p>
                          <p className="text-gray-400 text-sm">
                            ชำระผ่าน QR Code
                          </p>
                        </div>
                      </motion.label>
                      {paymentMethod === "promptpay" && (
                        <div className="p-4 bg-white rounded-xl shadow-md flex justify-center">
                          <QRCodeSVG value={qrCode} size={256} />
                        </div>
                      )}
                    </div>

                    {paymentMethod === "credit" && (
                      <motion.div
                        className="mt-6 space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div>
                          <label className="block text-gray-300 mb-2">
                            หมายเลขบัตร
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-300 mb-2">
                              วันหมดอายุ
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">
                            ชื่อผู้ถือบัตร
                          </label>
                          <input
                            type="text"
                            placeholder="SOMCHAI JAIDEE"
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <CheckCircle className="mr-3 text-purple-400" />
                      ยืนยันคำสั่งซื้อ
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          ข้อมูลการจัดส่ง
                        </h3>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          {selectedAddress ? (
                            <>
                              <p className="text-white font-medium">
                                {selectedAddress.RecipientName}
                              </p>
                              <p className="text-gray-300">
                                {selectedAddress.Phone}
                              </p>
                              <p className="text-gray-300">
                                {selectedAddress.Address}
                              </p>
                              <p className="text-gray-300">
                                {selectedAddress.Other}
                              </p>
                              <p className="text-gray-300">
                                {selectedAddress.SubDistrict}{" "}
                                {selectedAddress.District}{" "}
                                {selectedAddress.Province}{" "}
                                {selectedAddress.PostalCode}
                              </p>
                            </>
                          ) : (
                            <p className="text-gray-400">
                              ไม่มีที่อยู่ที่เลือก
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          วิธีการชำระเงิน
                        </h3>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-white">
                            {paymentMethod === "credit" && "บัตรเครดิต/เดบิต"}
                            {paymentMethod === "promptpay" && "PromptPay"}
                            {paymentMethod === "bank" && "โอนผ่านธนาคาร"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          วิธีการจัดส่ง
                        </h3>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-white">
                            {shippingMethod === "standard"
                              ? "จัดส่งมาตรฐาน (5-7 วันทำการ)"
                              : "จัดส่งด่วน (1-2 วันทำการ)"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                <motion.button
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                    currentStep === 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                  whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
                  whileTap={currentStep > 1 ? { scale: 0.95 } : {}}
                >
                  <ArrowLeft className="mr-2" size={20} />
                  ย้อนกลับ
                </motion.button>

                <motion.button
                  onClick={
                    currentStep === 3
                      ? () => router.push("/user/profile")
                      : handleNext
                  }
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStep === 3 ? "ยืนยันคำสั่งซื้อ" : "ถัดไป"}
                </motion.button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 sticky top-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <ShoppingCart className="mr-3 text-purple-400" />
                  สรุปคำสั่งซื้อ
                </h3>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item: any) => (
                    <div key={item.ID} className="flex items-center space-x-3">
                      <img
                        src={
                          item.Product?.Images?.[0]?.Url ||
                          "/placeholder-image.jpg"
                        }
                        alt={item.Product?.Name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm line-clamp-2">
                          {item.Product?.Name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          ฿{formatPrice(item.Product?.Price || 0)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 mt-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.Product?.ID,
                                  Math.max(1, item.Quantity - 1)
                                )
                              }
                              disabled={item.Quantity === 1}
                              className={`w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs 
                              ${
                                item.Quantity === 1
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-white text-sm w-8 text-center">
                              {item.Quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.Product?.ID,
                                  item.Quantity + 1
                                )
                              }
                              className="w-6 h-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-xs"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.ID)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>ยอดรวมสินค้า:</span>
                    <span>฿{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>ค่าจัดส่ง:</span>
                    <span>฿{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-white border-t border-gray-700 pt-3">
                    <span>รวมทั้งหมด:</span>
                    <span>฿{formatPrice(total)}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
