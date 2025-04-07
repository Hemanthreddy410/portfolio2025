"use client";
import { motion } from "framer-motion";
import { FlipWords } from "@/components/ui/flip-words";
import { SparklesCore } from "@/components/ui/sparkles";
export default function About() {
  const words = [
    "analyze data",
    "explore cloud computing",
    "build ML models",
    "read technical books",
  ];
  return (
    <div
      id="about-page"
      className="h-screen w-full text-white overflow-hidden relative"
      data-theme-target="about-page"
    >
      {/* Pure Black Background */}
      <div
        id="about-background"
        className="absolute inset-0"
        data-theme-target="about-background"
      />

      {/* Animated Sparkles */}
      <div
        id="about-sparkles-container"
        className="absolute inset-0 w-full h-full"
      >
        <SparklesCore
          id="about-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
          data-theme-target="about-sparkles"
        />
      </div>

      {/* Gradient Overlay */}
      <div
        id="about-overlay"
        className="absolute inset-0"
        data-theme-target="about-overlay"
      />

      <div className="relative z-10 h-full">
        <main
          id="about-content"
          className="container mx-auto px-4 h-full flex items-center justify-center"
        >
          <div id="about-container" className="max-w-4xl">
            <motion.div
              id="about-title-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1
                id="about-title"
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500"
                data-theme-target="about-title"
              >
                About Me
              </h1>
            </motion.div>

            <motion.div
              id="about-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8 text-center md:text-left backdrop-blur-sm bg-neutral-900/20 p-8 rounded-2xl border border-neutral-800"
              data-theme-target="about-card"
            >
              <p
                id="about-intro"
                className="text-2xl md:text-3xl font-semibold text-neutral-200 leading-relaxed"
              >
                I&apos;m a versatile Software Engineer with expertise in data engineering and ServiceNow development.
              </p>

              <p
                id="about-description-1"
                className="text-lg md:text-xl text-neutral-300 leading-relaxed"
              >
                With over 4 years of professional experience, I specialize in designing ETL/ELT pipelines, implementing ServiceNow solutions, and developing data-driven applications. I&apos;m passionate about optimizing data infrastructure and automating business processes using Python, SQL, JavaScript, and cloud technologies.
              </p>

              <p
                id="about-description-2"
                className="text-lg md:text-xl text-neutral-300 leading-relaxed"
              >
                Currently pursuing my Master&apos;s degree in Computer and Information Sciences at Florida International University, I&apos;m diving deeper into advanced software engineering, AI, and machine learning to enhance my skills in developing intelligent data solutions that drive business value.
              </p>

              <div
                id="about-hobbies"
                className="text-lg md:text-xl text-neutral-300 leading-relaxed"
              >
                When I&apos;m not coding, I usually
                <FlipWords words={words} className="text-white" />
              </div>

              <motion.div
                id="about-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-6"
              ></motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}