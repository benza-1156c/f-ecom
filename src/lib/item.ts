export const menuItems = [
  { name: "หน้าแรก", href: "#" },
  { name: "สินค้า", href: "/user/product" },
  { name: "หมวดหมู่", href: "#" },
  { name: "โปรโมชั่น", href: "#" },
  { name: "เกี่ยวกับเรา", href: "#" },
  { name: "ติดต่อ", href: "#" },
];

export const userMenuItems = [
  {
    name: "บัญชีผู้ใช้",
    icon: "mdi:account",
    href: "/user/profile",
  },
  {
    name: "คำสั่งซื้อ",
    icon: "mdi:package-variant-closed",
    href: "/user/orders",
  },
  {
    name: "รายการโปรด",
    icon: "mdi:heart",
    href: "/user/wishlist",
  },
  {
    name: "ตั้งค่า",
    icon: "mdi:cog",
    href: "/user/settings",
  },
  {
    name: "ออกจากระบบ",
    icon: "mdi:logout",
    href: "/logout",
    isLogout: true,
  },
];
