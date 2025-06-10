"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const AdminGuard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (!user || user.Role !== "admin") {
        setUnauthorized(true);
      }
    }
  }, [loading, user]);

  useEffect(() => {
    if (unauthorized) {
      router.push("/");
    }
  }, [unauthorized, router]);

  if (!user || loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                กำลังตรวจสอบสิทธิ์
              </h3>
              <p className="text-gray-400 text-sm">โปรดรอสักครู่...</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          className="bg-gray-800 border border-red-500/20 rounded-2xl p-8 shadow-2xl max-w-full mx-4"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="text-center">
            <motion.div
              className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-3">
                เข้าถึงถูกปฏิเสธ
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                คุณไม่มีสิทธิ์เข้าถึงหน้านี้ <br />
                กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์ในการเข้าถึง
              </p>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => router.push("/")}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                กลับไปหน้าหลัก
              </motion.button>

              <motion.button
                onClick={() => router.back()}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ย้อนกลับ
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default AdminGuard;
