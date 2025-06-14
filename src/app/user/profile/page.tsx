"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Nav/Navbar";
import { useAuth } from "@/app/AuthProvider";
import Image from "next/image";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("addresses");
  const [saving, setSaving] = useState(false);
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [provinceLoading, setProvinceLoading] = useState(false);

  const [addressForm, setAddressForm] = useState({
    type: "home" as "home" | "work" | "other",
    label: "",
    recipientName: "",
    lastName: "",
    phone: "",
    address: "",
    other: "",
    provinceId: "",
    province: "",
    amphureId: "",
    amphure: "",
    tambonId: "",
    tambon: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    isDefault: false,
  }) as any;
  const [provinces, setProvinces] = useState<any[]>([]);
  const [amphures, setAmphures] = useState<any[]>([]);
  const [tambons, setTambons] = useState<any[]>([]);

  useEffect(() => {
    fetchProvinces();
    fetchAddresses();
  }, []);

  const fetchProvinces = async () => {
    try {
      setProvinceLoading(true);
      const response = await fetch(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
      );
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error(error);
    } finally {
      setProvinceLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${api}/addresses`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleProvinceChange = (e: any) => {
    const provinceId = parseInt(e.target.value);
    const selectedProvince = provinces.find((p) => p.id === provinceId);

    setAddressForm({
      ...addressForm,
      provinceId: provinceId,
      province: selectedProvince?.name_th || "",
      amphureId: "",
      tambonId: "",
      district: "",
      subDistrict: "",
      postalCode: "",
    });

    if (selectedProvince) {
      setAmphures(selectedProvince.amphure || []);
    } else {
      setAmphures([]);
    }
    setTambons([]);
  };

  const handleAmphureChange = (e: any) => {
    const amphureId = parseInt(e.target.value);
    const selectedAmphure = amphures.find((a: any) => a.id === amphureId);

    setAddressForm({
      ...addressForm,
      amphureId: amphureId,
      district: selectedAmphure?.name_th || "",
      tambonId: "",
      subDistrict: "",
      postalCode: "",
    });

    if (selectedAmphure) {
      setTambons(selectedAmphure.tambon || []);
    } else {
      setTambons([]);
    }
  };

  const handleTambonChange = (e: any) => {
    const tambonId = parseInt(e.target.value);
    const selectedTambon = tambons.find((t) => t.id === tambonId);

    setAddressForm({
      ...addressForm,
      tambonId: tambonId,
      subDistrict: selectedTambon?.name_th || "",
      postalCode: selectedTambon?.zip_code || "",
    });
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addressForm.provinceId ||
      !addressForm.amphureId ||
      !addressForm.tambonId ||
      !addressForm.address ||
      !addressForm.phone ||
      !addressForm.recipientName ||
      !addressForm.lastName
    ) {
      toast.error("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
      return;
    }
    setSaving(true);
    try {
      const url = editingAddress
        ? `${api}/addresses/${editingAddress.ID}`
        : `${api}/addresses`;
      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addressForm),
      });
      if (!response.ok) throw new Error("Failed to save address");
      const data = await response.json();
      if (data.success) {
        setAddresses((prev) =>
          editingAddress
            ? prev.map((addr) =>
                addr.ID === editingAddress.ID ? data.data : addr
              )
            : [...prev, data.data]
        );
      }
      setShowAddressModal(false);
      setEditingAddress(null);
      resetAddressForm();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("ต้องการลบที่อยู่นี้หรือไม่?")) return;

    try {
      const response = await fetch(`${api}/addresses/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("ลบที่อยู่เรียบร้อย");
        setAddresses((prev) => prev.filter((addr) => addr.ID !== addressId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      type: "home",
      recipientName: "",
      lastName: "",
      district: "",
      province: "",
      provinceId: "",
      amphureId: "",
      tambonId: "",
      other: "",
      postalCode: "",
      phone: "",
      isDefault: false,
    });
  };

  const openEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      type: address?.Type,
      recipientName: address?.RecipientName,
      lastName: address?.LastName,
      district: address?.District,
      province: address?.Province,
      address: address?.Address,
      provinceId: address?.ProvinceId,
      amphureId: address?.AmphureId,
      tambonId: address?.TambonId,
      other: address?.Other,
      postalCode: address?.PostalCode,
      phone: address?.Phone,
      isDefault: address?.IsDefault,
    });
    const prov = provinces.find((p) => p.id === address?.ProvinceId);
    if (prov) {
      setAmphures(prov.amphure || []);
      const amph = prov.amphure?.find((a: any) => a.id === address?.AmphureId);
      if (amph) {
        setTambons(amph.tambon || []);
      }
    }
    setShowAddressModal(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      shipped: "bg-purple-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: "รอดำเนินการ",
      processing: "กำลังเตรียมสินค้า",
      shipped: "จัดส่งแล้ว",
      delivered: "ส่งถึงแล้ว",
      cancelled: "ยกเลิกแล้ว",
    };
    return texts[status as keyof typeof texts] || status;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Icon
              icon="ic:round-refresh"
              className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4"
            />
            <p className="text-gray-400">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Image
                  src={user?.Avatar || "/avatar.png"}
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-full"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {user?.UserName}
                </h1>
                <p className="text-gray-400 mb-2">{user?.Email}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg border border-gray-700">
            {[
              {
                id: "addresses",
                label: "ที่อยู่",
                icon: "ic:round-location-on",
              },
              {
                id: "orders",
                label: "ประวัติการสั่งซื้อ",
                icon: "ic:round-shopping-bag",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Icon icon={tab.icon} className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "addresses" && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <Icon
                          icon="ic:round-location-on"
                          className="w-6 h-6 text-purple-400"
                        />
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        ที่อยู่ของฉัน
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        resetAddressForm();
                        setShowAddressModal(true);
                      }}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                    >
                      <Icon icon="ic:round-add" className="w-5 h-5" />
                      <span className="font-medium">เพิ่มที่อยู่ใหม่</span>
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-gray-700/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                        <Icon
                          icon="ic:round-location-off"
                          className="w-12 h-12 text-gray-500"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-300 mb-3">
                        ยังไม่มีที่อยู่
                      </h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        เพิ่มที่อยู่เพื่อความสะดวกในการสั่งซื้อสินค้าและจัดส่งที่รวดเร็ว
                      </p>
                      <button
                        onClick={() => {
                          resetAddressForm();
                          setShowAddressModal(true);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl transition-colors font-medium"
                      >
                        เพิ่มที่อยู่แรกของคุณ
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {addresses?.map((address, index) => (
                        <motion.div
                          key={address.ID}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative group"
                        >
                          <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600 hover:border-purple-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                            {address?.IsDefault && (
                              <div className="absolute -top-2 -right-2 z-10">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
                                  <Icon
                                    icon="ic:round-check-circle"
                                    className="w-3 h-3"
                                  />
                                  <span>ค่าเริ่มต้น</span>
                                </div>
                              </div>
                            )}

                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-4">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-purple-500/20 p-2 rounded-lg">
                                    <Icon
                                      icon={
                                        address?.Type === "home"
                                          ? "ic:round-home"
                                          : address?.Type === "office"
                                          ? "ic:round-business"
                                          : "ic:round-location-on"
                                      }
                                      className="w-5 h-5 text-purple-400"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-white text-lg">
                                      {address?.RecipientName}{" "}
                                      {address?.LastName}
                                      {address?.Other && (
                                        <span className="text-gray-400 font-normal ml-2">
                                          ({address?.Other})
                                        </span>
                                      )}
                                    </h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="bg-gray-600/50 text-gray-300 px-2 py-1 rounded-md text-xs font-medium capitalize">
                                        {address?.Type === "home"
                                          ? "บ้าน"
                                          : address?.Type === "office"
                                          ? "ออฟฟิศ"
                                          : address?.Type}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                                  <div className="flex items-start space-x-2">
                                    <Icon
                                      icon="ic:round-location-on"
                                      className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                                    />
                                    <p className="text-gray-300 leading-relaxed">
                                      {address?.Address}
                                    </p>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Icon
                                      icon="ic:round-map"
                                      className="w-4 h-4 text-gray-400"
                                    />
                                    <p className="text-gray-400 text-sm">
                                      ตำบล {address?.SubDistrict} อำเภอ{" "}
                                      {address?.District} จังหวัด{" "}
                                      {address?.Province} {address?.PostalCode}
                                    </p>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Icon
                                      icon="ic:round-phone"
                                      className="w-4 h-4 text-gray-400"
                                    />
                                    <p className="text-gray-400 text-sm">
                                      {address?.Phone}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col space-y-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  onClick={() => openEditAddress(address)}
                                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 p-3 rounded-lg transition-all duration-200 hover:scale-110"
                                  title="แก้ไขที่อยู่"
                                >
                                  <Icon
                                    icon="ic:round-edit"
                                    className="w-5 h-5"
                                  />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteAddress(address.ID)
                                  }
                                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-3 rounded-lg transition-all duration-200 hover:scale-110"
                                  title="ลบที่อยู่"
                                >
                                  <Icon
                                    icon="ic:round-delete"
                                    className="w-5 h-5"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    ประวัติการสั่งซื้อ
                  </h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon
                        icon="ic:round-shopping-bag"
                        className="w-16 h-16 text-gray-600 mx-auto mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-400 mb-2">
                        ยังไม่มีประวัติการสั่งซื้อ
                      </h3>
                      <p className="text-gray-500">
                        เมื่อคุณสั่งซื้อสินค้า ประวัติจะแสดงที่นี่
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-white">
                                คำสั่งซื้อ #{order.orderNumber}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-1">
                                <div
                                  className={`w-2 h-2 rounded-full ${getStatusColor(
                                    order.status
                                  )}`}
                                ></div>
                                <span className="text-sm text-gray-300">
                                  {getStatusText(order.status)}
                                </span>
                              </div>
                              <p className="font-semibold text-white">
                                ฿{formatPrice(order.total)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>{order.items} รายการ</span>
                            <button className="text-purple-400 hover:text-purple-300">
                              ดูรายละเอียด
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showAddressModal && (
            <motion.div
              className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600/50 rounded-2xl shadow-2xl shadow-purple-500/10 p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-500/20 p-3 rounded-xl">
                      <Icon
                        icon={
                          editingAddress
                            ? "ic:round-edit-location"
                            : "ic:round-add-location"
                        }
                        className="w-6 h-6 text-purple-400"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {editingAddress ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {editingAddress
                          ? "อัปเดตข้อมูลที่อยู่ของคุณ"
                          : "เพิ่มที่อยู่สำหรับการจัดส่ง"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddressModal(false);
                      setEditingAddress(null);
                    }}
                    className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white p-3 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <Icon icon="ic:round-close" className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
                    <div className="flex items-center space-x-2 mb-4">
                      <Icon
                        icon="ic:round-person"
                        className="w-5 h-5 text-blue-400"
                      />
                      <h4 className="text-lg font-semibold text-white">
                        ข้อมูลผู้รับ
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          ชื่อผู้รับ <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={addressForm.recipientName}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              recipientName: e.target.value,
                            })
                          }
                          placeholder="กรอกชื่อผู้รับ"
                          required
                          className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          นามสกุล <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={addressForm.lastName}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="กรอกนามสกุล"
                          required
                          className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          เบอร์โทรศัพท์ <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phone: e.target.value,
                            })
                          }
                          placeholder="0XX-XXX-XXXX"
                          required
                          className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
                    <div className="flex items-center space-x-2 mb-4">
                      <Icon
                        icon="ic:round-category"
                        className="w-5 h-5 text-green-400"
                      />
                      <h4 className="text-lg font-semibold text-white">
                        ประเภทที่อยู่
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          เลือกประเภท
                        </label>
                        <select
                          value={addressForm.type}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              type: e.target.value as any,
                            })
                          }
                          className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="home">🏠 บ้าน</option>
                          <option value="other">📍 อื่นๆ</option>
                        </select>
                      </div>
                      {addressForm.type === "other" && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            ชื่อที่อยู่
                          </label>
                          <input
                            type="text"
                            value={addressForm.other || ""}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                other: e.target.value,
                              })
                            }
                            placeholder="เช่น บ้านแม่, ร้านค้า, ออฟฟิศ"
                            className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
                    <div className="flex items-center space-x-2 mb-4">
                      <Icon
                        icon="ic:round-location-on"
                        className="w-5 h-5 text-orange-400"
                      />
                      <h4 className="text-lg font-semibold text-white">
                        ที่อยู่
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          จังหวัด <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={addressForm.provinceId || ""}
                          onChange={handleProvinceChange}
                          required
                          disabled={loading}
                          className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {loading ? "🔄 กำลังโหลด..." : "📍 เลือกจังหวัด"}
                          </option>
                          {provinces.map((province) => (
                            <option key={province.id} value={province.id}>
                              {province.name_th}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          เขต/อำเภอ <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={addressForm.amphureId || ""}
                          onChange={handleAmphureChange}
                          disabled={!addressForm.provinceId}
                          required
                          className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">🏘️ เลือกเขต/อำเภอ</option>
                          {amphures.map((amphure) => (
                            <option key={amphure.id} value={amphure.id}>
                              {amphure.name_th}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          แขวง/ตำบล <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={addressForm.tambonId || ""}
                          onChange={handleTambonChange}
                          disabled={!addressForm.amphureId}
                          required
                          className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">🌆 เลือกแขวง/ตำบล</option>
                          {tambons.map((tambon) => (
                            <option key={tambon.id} value={tambon.id}>
                              {tambon.name_th}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          รหัสไปรษณีย์ <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={addressForm.postalCode}
                            readOnly
                            placeholder="จะแสดงอัตโนมัติเมื่อเลือกตำบล"
                            className="w-full bg-gray-600/50 border border-gray-500/50 rounded-xl p-3 text-white placeholder-gray-400 cursor-not-allowed"
                          />
                          <Icon
                            icon="ic:round-lock"
                            className="absolute right-3 top-3 w-5 h-5 text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        ที่อยู่โดยละเอียด{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={addressForm.address || ""}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            address: e.target.value,
                          })
                        }
                        placeholder="เลขที่, หมู่บ้าน, ซอย, ถนน และรายละเอียดอื่นๆ"
                        rows={3}
                        className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-500/20 p-2 rounded-lg">
                          <Icon
                            icon="ic:round-check-circle"
                            className="w-5 h-5 text-green-400"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="isDefault"
                            className="text-lg font-medium text-white cursor-pointer"
                          >
                            ตั้งเป็นที่อยู่หลัก
                          </label>
                          <p className="text-sm text-gray-400">
                            ใช้เป็นที่อยู่เริ่มต้นสำหรับการสั่งซื้อ
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={addressForm.isDefault}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              isDefault: e.target.checked,
                            })
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                            addressForm.isDefault
                              ? "bg-green-500"
                              : "bg-gray-600"
                          }`}
                          onClick={() =>
                            setAddressForm({
                              ...addressForm,
                              isDefault: !addressForm.isDefault,
                            })
                          }
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                              addressForm.isDefault
                                ? "translate-x-7"
                                : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressModal(false);
                        setEditingAddress(null);
                      }}
                      className="flex-1 bg-gray-600/50 hover:bg-gray-600/70 border border-gray-500/50 hover:border-gray-400/50 text-gray-300 hover:text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                      <Icon icon="ic:round-close" className="w-5 h-5" />
                      <span>ยกเลิก</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddressSubmit}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 px-6 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <Icon
                        icon={editingAddress ? "ic:round-save" : "ic:round-add"}
                        className="w-5 h-5"
                      />
                      <span>
                        {editingAddress ? "บันทึกการแก้ไข" : "เพิ่มที่อยู่"}
                      </span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProfilePage;
