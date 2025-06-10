import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Star, Zap, Shield, Truck } from "lucide-react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "คอลเลกชันใหม่ 2025",
      subtitle: "แฟชั่นล้ำสมัย",
      description: "ค้นพบสินค้าแฟชั่นล่าสุดที่จะทำให้คุณโดดเด่น",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      buttonText: "ช้อปเลย",
      discount: "ลด 50%",
      bgGradient: "from-purple-900 via-blue-900 to-indigo-900"
    },
    {
      id: 2,
      title: "เทคโนโลยีล่าสุด",
      subtitle: "อุปกรณ์อิเล็กทรอนิกส์",
      description: "พบกับแกดเจ็ตและเทคโนโลยีใหม่ล่าสุด",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      buttonText: "ดูสินค้า",
      discount: "ลด 30%",
      bgGradient: "from-gray-900 via-purple-900 to-violet-900"
    },
    {
      id: 3,
      title: "ของใช้ในบ้าน",
      subtitle: "ตกแต่งบ้านสวย",
      description: "เฟอร์นิเจอร์และของตกแต่งที่จะทำให้บ้านคุณสวยขึ้น",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      buttonText: "เลือกซื้อ",
      discount: "ลด 40%",
      bgGradient: "from-emerald-900 via-teal-900 to-cyan-900"
    }
  ];

  const features = [
    {
      icon: Truck,
      title: "จัดส่งฟรี",
      description: "สั่งซื้อขั้นต่ำ 500 บาท"
    },
    {
      icon: Shield,
      title: "รับประกันคุณภาพ",
      description: "สินค้าของแท้ 100%"
    },
    {
      icon: Zap,
      title: "จัดส่งเร็ว",
      description: "ได้รับภายใน 24 ชั่วโมง"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="relative bg-black text-white overflow-hidden">
      {/* Main Hero Slider */}
      <div className="relative h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].bgGradient}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Background Image */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10 }}
            >
              <img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover opacity-30"
              />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex items-center h-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    className="text-center lg:text-left"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {/* Discount Badge */}
                    <motion.div
                      className="inline-block mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                        {heroSlides[currentSlide].discount}
                      </span>
                    </motion.div>

                    <motion.h1
                      className="text-5xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      {heroSlides[currentSlide].title}
                    </motion.h1>

                    <motion.h2
                      className="text-2xl lg:text-3xl font-semibold text-purple-300 mb-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      {heroSlides[currentSlide].subtitle}
                    </motion.h2>

                    <motion.p
                      className="text-lg lg:text-xl text-gray-300 mb-8 max-w-md mx-auto lg:mx-0"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      {heroSlides[currentSlide].description}
                    </motion.p>

                    <motion.div
                      className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      <motion.button
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingBag size={20} />
                        {heroSlides[currentSlide].buttonText}
                      </motion.button>

                      <motion.button
                        className="border-2 border-white text-white hover:bg-white hover:text-black font-bold py-4 px-8 rounded-full transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ดูคอลเลกชัน
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  {/* Product Showcase */}
                  <motion.div
                    className="relative hidden lg:block"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={heroSlides[currentSlide].image}
                          alt="Product"
                          className="w-full h-80 object-cover rounded-2xl"
                        />
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-sm text-gray-300">(4.8)</span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">สินค้าแนะนำ</h3>
                          <p className="text-gray-300 text-sm mb-4">คุณภาพพรีเมียม ราคาดีที่สุด</p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-purple-300">฿1,999</span>
                            <span className="text-sm text-gray-400 line-through">฿3,999</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300 z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300 z-20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-purple-500 w-8' : 'bg-white bg-opacity-50 hover:bg-opacity-70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="inline-block p-4 bg-purple-600 rounded-full mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon size={32} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "ลูกค้าที่พึงพอใจ" },
              { number: "10K+", label: "สินค้าคุณภาพ" },
              { number: "24/7", label: "บริการลูกค้า" },
              { number: "99%", label: "ความพึงพอใจ" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-purple-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;