import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bgGradient: string;
  image: string;
  accent: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: "Chào mừng đến với Lena Food",
    subtitle: "🍽️ Ẩm thực tuyệt vời",
    description:
      "Khám phá hàng nghìn món ăn ngon từ khắp mọi miền. Đặt hàng dễ dàng, giao hàng tận nơi.",
    buttonText: "Khám phá ngay",
    buttonLink: "/products",
    bgGradient: "from-purple-600 via-purple-500 to-blue-500",
    image: "🍜",
    accent: "bg-yellow-400",
  },
  {
    id: 2,
    title: "Giao hàng siêu tốc ⚡",
    subtitle: "Nhanh chóng & Tiện lợi",
    description:
      "Đặt hàng online, giao hàng trong 30 phút. Thanh toán dễ dàng, theo dõi đơn hàng realtime.",
    buttonText: "Đặt hàng ngay",
    buttonLink: "/products",
    bgGradient: "from-green-500 via-emerald-500 to-teal-500",
    image: "🚚",
    accent: "bg-orange-400",
  },
  {
    id: 3,
    title: "Ưu đãi đặc biệt 🎉",
    subtitle: "Giảm giá đến 50%",
    description:
      "Khuyến mãi hấp dẫn cho thành viên mới. Tích điểm, đổi quà, nhận voucher miễn phí.",
    buttonText: "Xem ưu đãi",
    buttonLink: "/products?discount=true",
    bgGradient: "from-pink-500 via-rose-500 to-orange-500",
    image: "🎁",
    accent: "bg-green-400",
  },
  {
    id: 4,
    title: "Món ăn chất lượng cao 👨‍🍳",
    subtitle: "Từ những đầu bếp giỏi nhất",
    description:
      "Được chế biến bởi các chef chuyên nghiệp. Nguyên liệu tươi ngon, đảm bảo vệ sinh an toàn.",
    buttonText: "Thử ngay",
    buttonLink: "/products?popular=true",
    bgGradient: "from-indigo-500 via-blue-500 to-cyan-500",
    image: "👨‍🍳",
    accent: "bg-red-400",
  },
];

export const ModernBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <div
      className="relative h-[80vh] min-h-[600px] overflow-hidden rounded-3xl mx-4 my-8 shadow-2xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-br ${bannerSlides[currentSlide].bgGradient}`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-1/3 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-white rounded-full"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                  className="text-center lg:text-left"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <motion.div
                    className={`inline-block px-4 py-2 ${bannerSlides[currentSlide].accent} text-white rounded-full text-sm font-medium mb-4`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    {bannerSlides[currentSlide].subtitle}
                  </motion.div>

                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {bannerSlides[currentSlide].title}
                  </motion.h1>

                  <motion.p
                    className="text-xl text-white/90 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    {bannerSlides[currentSlide].description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <Link
                      to={bannerSlides[currentSlide].buttonLink}
                      className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                    >
                      {bannerSlides[currentSlide].buttonText}
                      <motion.span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Image/Emoji */}
                <motion.div
                  className="flex justify-center lg:justify-end"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <motion.div
                    className="text-[200px] md:text-[250px] lg:text-[300px] leading-none filter drop-shadow-2xl"
                    animate={floatingAnimation}
                  >
                    {bannerSlides[currentSlide].image}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 z-20"
      >
        ←
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 z-20"
      >
        →
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm z-20">
        {currentSlide + 1} / {bannerSlides.length}
      </div>
    </div>
  );
};

export default ModernBanner;
