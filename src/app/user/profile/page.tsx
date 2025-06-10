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
    other: "",
    province: "",
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
    if (!addressForm.provinceId || !addressForm.amphureId || !addressForm.tambonId) {
      toast.error("กรุณาเลือกจังหวัด, อำเภอ, และตำบล");
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
            ? prev.map((addr) => (addr.ID === editingAddress.ID ? data.data : addr))
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
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete address");
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      type: "home",
      recipientName: "",
      lastName: "",
      district: "",
      province: "",
      postalCode: "",
      phone: "",
      isDefault: false,
    });
  };

  const openEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      type: address.Type,
      recipientName: address.RecipientName,
      lastName: address.LastName,
      address: address.Address,
      district: address.District,
      province: address.Province,
      other: address.Other,
      postalCode: "",
      phone: address.Phone,
      isDefault: address.IsDefault,
    });
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
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Icon
                      icon={
                        user?.isPhoneVerified
                          ? "ic:round-verified"
                          : "ic:round-error"
                      }
                      className={`w-4 h-4 ${
                        user?.isPhoneVerified
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                    <span className="text-sm text-gray-400">
                      เบอร์โทร
                      {user?.isPhoneVerified ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน"}
                    </span>
                  </div>
                </div>
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
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      ที่อยู่ของฉัน
                    </h2>
                    <button
                      onClick={() => {
                        resetAddressForm();
                        setShowAddressModal(true);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Icon icon="ic:round-add" className="w-4 h-4" />
                      <span>เพิ่มที่อยู่ใหม่</span>
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon
                        icon="ic:round-location-off"
                        className="w-16 h-16 text-gray-600 mx-auto mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-400 mb-2">
                        ยังไม่มีที่อยู่
                      </h3>
                      <p className="text-gray-500 mb-4">
                        เพิ่มที่อยู่เพื่อความสะดวกในการสั่งซื้อสินค้า
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses?.map((address) => (
                        <div
                          key={address.ID}
                          className="border border-gray-700 rounded-lg p-4 relative"
                        >
                          {address.isDefault && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                              ค่าเริ่มต้น
                            </div>
                          )}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Icon
                                  icon="ic:round-location-on"
                                  className="w-5 h-5 text-purple-500"
                                />
                                <span className="font-medium text-white">
                                  {address?.Other}
                                </span>
                                <span className="text-sm text-gray-400 capitalize">
                                  ({address?.Type})
                                </span>
                              </div>
                              <p className="text-gray-300 mb-1">
                                {address?.Address}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {address?.District} {address?.Province}
                                {address?.PostalCode}
                              </p>
                              <p className="text-gray-400 text-sm">
                                โทร: {address?.Phone}
                              </p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => openEditAddress(address)}
                                className="text-blue-400 hover:text-blue-300 p-1"
                              >
                                <Icon
                                  icon="ic:round-edit"
                                  className="w-4 h-4"
                                />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Icon
                                  icon="ic:round-delete"
                                  className="w-4 h-4"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
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
              className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    {editingAddress ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddressModal(false);
                      setEditingAddress(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <Icon icon="ic:round-close" className="w-6 h-6" />
                  </button>
                </div>

                <form
                  onSubmit={handleAddressSubmit}
                  className="space-y-4 grid grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      นามสกุลผู้รับ <span className="text-red-400">*</span>
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
                      placeholder="กรอกนามสกุลผู้รับ"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      เบอร์โทรศัพท์ <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="0XX-XXX-XXXX"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ประเภทที่อยู่
                    </label>
                    <select
                      value={addressForm.type}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          type: e.target.value as any,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="home">บ้าน</option>
                      <option value="other">อื่นๆ</option>
                    </select>
                  </div>
                  {addressForm.type === "other" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
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
                        placeholder="เช่น บ้านแม่, ร้านค้า"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      จังหวัด <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={addressForm.provinceId || ""}
                      onChange={handleProvinceChange}
                      required
                      disabled={loading}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value="">
                        {loading ? "กำลังโหลด..." : "เลือกจังหวัด"}
                      </option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name_th}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      เขต/อำเภอ <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={addressForm.amphureId || ""}
                      onChange={handleAmphureChange}
                      disabled={!addressForm.provinceId}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">เลือกเขต/อำเภอ</option>
                      {amphures.map((amphure) => (
                        <option key={amphure.id} value={amphure.id}>
                          {amphure.name_th}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      แขวง/ตำบล <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={addressForm.tambonId || ""}
                      onChange={handleTambonChange}
                      disabled={!addressForm.amphureId}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">เลือกแขวง/ตำบล</option>
                      {tambons.map((tambon) => (
                        <option key={tambon.id} value={tambon.id}>
                          {tambon.name_th}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      รหัสไปรษณีย์ <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.postalCode}
                      readOnly
                      placeholder="จะแสดงอัตโนมัติเมื่อเลือกตำบล"
                      className="w-full bg-gray-600 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-center">
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
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label
                      htmlFor="isDefault"
                      className="ml-2 text-sm text-gray-300"
                    >
                      ตั้งเป็นที่อยู่หลัก
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressModal(false);
                        setEditingAddress(null);
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      onClick={handleAddressSubmit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      {editingAddress ? "แก้ไข" : "บันทึก"}
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
