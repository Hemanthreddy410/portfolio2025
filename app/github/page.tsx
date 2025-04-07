"use client";
import { motion } from "framer-motion";
import { FiGithub } from "react-icons/fi";
import { useState } from "react";
import { GitHubContributions } from "@/components/tools/githubcontribution";
import Head from "next/head";

// SEO keywords and descriptions
const SEO = {
  title: "Hemanth Reddy Yarraguravagari | GitHub Contributions",
  description: "View my GitHub contribution history and software development activity.",
  keywords:
    "GitHub contributions, coding activity, data engineering, ServiceNow, Python, SQL, AWS, developer portfolio",
};

export default function Contributions() {
  const [isContributionVisible, setIsContributionVisible] = useState(false);

  // Animation variants for the contribution section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      <Head>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <meta name="keywords" content={SEO.keywords} />
      </Head>

      <div className="min-h-auto w-full text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl mb-10 text-center sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
            GitHub Contributions
          </h1>

          <motion.section
            className="mb-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            onViewportEnter={() => setIsContributionVisible(true)}
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl shadow-xl overflow-hidden relative"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

              {/* Header */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
              >
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Contribution Activity
                  </h2>
                  <p className="text-neutral-300 text-sm mt-2">
                    Projects focused on data engineering, ETL pipelines, ServiceNow customization, and AI analytics
                  </p>
                </div>

                <motion.a
                  href="https://github.com/Hemanthreddy410"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg z-10 bg-neutral-800/80 hover:bg-neutral-700/80 transition-all duration-300 text-sm border border-neutral-700/50 hover:border-blue-500/30 group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiGithub className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                  <span>View GitHub Profile</span>
                </motion.a>
              </motion.div>

              {/* Featured repositories */}
              <motion.div 
                variants={itemVariants}
                className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700/30 hover:border-blue-500/20 transition-all duration-300">
                  <h3 className="font-medium text-blue-400">CSV AI Analytics</h3>
                  <p className="text-sm text-neutral-300 mt-1">Data analysis platform combining AI-powered insights with interactive visualizations for diverse datasets.</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-neutral-700/50 text-neutral-300 text-xs rounded-full">Python</span>
                    <span className="px-2 py-1 bg-neutral-700/50 text-neutral-300 text-xs rounded-full">Streamlit</span>
                    <span className="px-2 py-1 bg-neutral-700/50 text-neutral-300 text-xs rounded-full">Claude API</span>
                  </div>
                </div>
                <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700/30 hover:border-blue-500/20 transition-all duration-300">
                  <h3 className="font-medium text-blue-400">ServiceNow CMDB Health Dashboard</h3>
                  <p className="text-sm text-neutral-300 mt-1">Enterprise-level CMDB health monitoring dashboard using Performance Analytics and custom scripting.</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-neutral-700/50 text-neutral-300 text-xs rounded-full">ServiceNow</span>
                    <span className="px-2 py-1 bg-neutral-700/50 text-neutral-300 text-xs rounded-full">JavaScript</span>
                    <span className="px-2 py-1 bg-neutral-700/50 text-neutral-300 text-xs rounded-full">Performance Analytics</span>
                  </div>
                </div>
              </motion.div>

              {/* Contribution graph */}
              <div className="relative rounded-sm overflow-x-auto">
                {isContributionVisible && (
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 5 }}
                      className="w-full"
                    >
                      <GitHubContributions username="Hemanthreddy410" />
                    </motion.div>

                    {/* Loading animation overlay */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 bottom-0 z-20 overflow-x-auto pointer-events-none"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.4, delay: 4 }}
                    >
                      {/* Grid of blocks */}
                      <div style={{ minWidth: "750px", padding: "16px" }}>
                        <div className="grid grid-cols-[repeat(53,1fr)] grid-rows-7 gap-[4px]">
                          {Array.from({ length: 371 }).map((_, index) => {
                            const colors = [
                              "rgba(22, 27, 34, 0.5)",
                              "rgba(14, 68, 41, 0.8)",
                              "rgba(0, 109, 50, 0.8)",
                              "rgba(38, 166, 65, 0.8)",
                              "rgba(57, 211, 83, 0.8)",
                            ];

                            const random = Math.random();
                            let colorIndex;
                            if (random < 0.6) colorIndex = 0;
                            else if (random < 0.8) colorIndex = 1;
                            else if (random < 0.9) colorIndex = 2;
                            else if (random < 0.97) colorIndex = 3;
                            else colorIndex = 4;

                            return (
                              <motion.div
                                key={`block-${index}`}
                                className="w-full h-full rounded-sm"
                                style={{
                                  backgroundColor: colors[colorIndex],
                                  height: "14px",
                                  minHeight: "8px",
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                  duration: 0.2,
                                  delay: Math.random() * 4.5,
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Loading indicator */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <div className="px-4 py-2 bg-neutral-800/80 rounded-full flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 bg-[rgba(38,166,65,0.8)] rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <span className="text-xs text-neutral-300">
                            Loading contribution data...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Tech stack */}
              <motion.div 
                variants={itemVariants}
                className="mt-8 pt-8 border-t border-neutral-800"
              >
                <h3 className="text-lg font-semibold mb-4 text-neutral-200">Primary Technologies</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm">Python</span>
                  <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm">SQL</span>
                  <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm">ServiceNow</span>
                  <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm">JavaScript</span>
                  <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm">AWS</span>
                  <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm">Azure</span>
                  <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm">ETL/ELT</span>
                  <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm">Data Warehousing</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </>
  );
}