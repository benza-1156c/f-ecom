"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from "@/app/AuthProvider";
import { userMenuItems } from "@/lib/item";

const UserModal = ({ isUserOpen, setIsUserOpen }: any) => {
  const dropdownRef = useRef(null) as any;
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserOpen(false);
      }
    };

    if (isUserOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserOpen, setIsUserOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <AnimatePresence>
        {isUserOpen && (
          <motion.div
            className="absolute top-2 left-1/2 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 transform -translate-x-1/2"
            initial={{
              opacity: 0,
              y: -10,
              scale: 0.95,
              transformOrigin: "top right",
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.Avatar}
                  className="w-10 h-10 rounded-full"
                  alt={user?.UserName}
                />
                <div>
                  <h3 className="text-white font-medium">{user?.UserName}</h3>
                  <p className="text-gray-400 text-sm">{user?.Email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {userMenuItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    item.isLogout
                      ? "text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                  onClick={() => setIsUserOpen(false)}
                >
                  <Icon icon={item.icon} width="18" height="18" />
                  <span>{item.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserModal;
