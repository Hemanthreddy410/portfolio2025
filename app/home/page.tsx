"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaPython, FaAws } from "react-icons/fa";
import { SiServicenow } from "react-icons/si";

const glitchAnimation = {
  textShadow: [
    "0 0 0 #00ffff",
    "2px 2px 0 #ff00ff, -2px -2px 0 #00ffff, 2px 2px 0 #ff00ff",
    "0 0 0 #00ffff",
  ],
  opacity: [1, 0.8, 1],
  x: [0, -1, 1, 0],
};

export default function HomePage() {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setIsGlitching(false);
      }, 100);
    }, 15000); // Changed the interval to 15000ms

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <main
      id="home"
      className="container mx-auto px-4 min-h-screen flex items-center justify-center pt-16 md:pt-0"
    >
      <div
        id="home-content-wrapper"
        className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-7xl w-full py-8 md:py-0"
      >
        {/* Profile Image Section */}
        <div
          id="home-profile-section"
          className="flex-1 flex justify-center relative order-1 md:order-2"
        >
          <motion.div
            id="home-profile-image-container"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div
              id="home-profile-image-wrapper"
              className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72"
            >
              <div className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-[40px]" />
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-dashed"
              />
              <motion.div
                className="absolute inset-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full overflow-hidden border-2 border-blue-500/30"
                animate={{
                  x: isGlitching ? [-2, 2, -2, 0] : 0,
                  y: isGlitching ? [1, -1, 1, 0] : 0,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/hemanth_reddy.jpg"
                    alt="Profile"
                    fill
                    className={`object-cover rounded-full p-2 transition-opacity duration-100 ${
                      isGlitching ? "opacity-0" : "opacity-100"
                    }`}
                    priority
                  />
                  <Image
                    src="/profile2.png"
                    alt="Profile Glitch"
                    fill
                    className={`object-cover rounded-full p-2 transition-opacity duration-100 ${
                      isGlitching ? "opacity-100" : "opacity-0"
                    }`}
                    priority
                  />
                </div>
                {isGlitching && (
                  <motion.div
                    className="absolute inset-0 bg-blue-500/30"
                    animate={{
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 0.1,
                    }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Data Symbol */}
          <motion.div
            id="home-data-symbol"
            className="absolute -bottom-6 right-0 sm:-bottom-10 md:-bottom-12 scale-50 sm:scale-90 md:scale-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            <TextHoverEffect text="⟨⟩" />
          </motion.div>
        </div>

        {/* Text Content Section */}
        <motion.div
          id="home-text-content"
          className="flex-1 text-center md:text-left space-y-4 md:space-y-8 order-2 md:order-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1
            id="home-title"
            className="text-2xl sm:text-4xl md:text-6xl lg:text-6xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Hi, I&apos;m <br className="hidden sm:block" />
            <motion.span
              className="text-blue-500 inline-block"
              animate={glitchAnimation}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                repeatDelay: 5,
              }}
            >
              Hemanth Reddy
            </motion.span>
          </motion.h1>

          <motion.p
            id="home-subtitle"
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Software Engineer | Data Specialist | ServiceNow Expert
          </motion.p>

          <motion.p
            id="home-description"
            className="text-sm sm:text-base md:text-lg text-gray-500 max-w-xl mx-auto md:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Versatile Software Engineer with 4+ years of experience across data engineering, ServiceNow development, 
            and software applications. Skilled in designing ETL/ELT pipelines, implementing ServiceNow solutions, 
            and developing data-driven applications using Python, SQL, JavaScript, and cloud technologies.
          </motion.p>

          <motion.div
            id="home-action-buttons"
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 md:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div
              id="home-main-buttons"
              className="flex flex-row gap-4 items-center"
            >
              {/* CV Button */}
              <div
                id="home-cv-button-wrapper"
                className="relative w-[140px] overflow-hidden rounded-md"
              >
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-xy" />
                </div>
                <div className="absolute inset-[2px] bg-[#2a2a2a] rounded-[4px]" />
                <button
                  onClick={() => (window.location.href = "/resume")}
                  className="relative z-10 w-full px-6 py-[6px] flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <span className="text-white">View CV</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </button>
              </div>

              {/* Contact Button */}
              <div
                id="home-contact-button-wrapper"
                className="relative w-[140px] overflow-hidden rounded-md"
              >
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-xy" />
                </div>
                <div className="absolute inset-[2px] bg-[#2a2a2a] rounded-[4px]" />
                <button
                  onClick={() => (window.location.href = "/contact")}
                  className="relative z-10 w-full px-6 py-[6px] flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <span className="text-white">Contact</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            {/* Social Links */}
            <motion.div
              id="home-social-links"
              className="flex gap-6 items-center mt-4 sm:mt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <a
                href="https://github.com/Hemanthreddy410"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-125 hover:rotate-12"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://linkedin.com/in/hemanth-reddy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-125 hover:-rotate-12"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-125 hover:rotate-12"
              >
                <SiServicenow size={24} />
              </a>
            </motion.div>
          </motion.div>

          {/* Technology Badges */}
          <motion.div
            id="home-tech-badges"
            className="flex flex-wrap gap-3 justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">Python</span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">ServiceNow</span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">AWS</span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">SQL</span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">Data Engineering</span>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}