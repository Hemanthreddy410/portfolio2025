"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiGithub, FiExternalLink, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import Head from "next/head";

// SEO keywords and descriptions
const SEO = {
  title: "Hemanth Reddy Yarraguravagari | Projects Portfolio",
  description:
    "Explore my portfolio of data engineering, ServiceNow development, and software engineering projects featuring Python, SQL, AWS, and data visualization applications.",
  keywords:
    "portfolio, data engineer, software engineer, ServiceNow, Python, SQL, ETL/ELT, AWS, data visualization, CMDB, machine learning, dashboard, computer vision, Streamlit, Plotly, Claude API",
};

type MediaType = "image" | "youtube";

type Project = {
  id: number;
  title: string;
  description: string;
  media: {
    type: MediaType;
    src: string; // image path or YouTube video ID
  };
  tags: string[];
  link: string;
  github: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "CSV AI Analytics",
    description:
      "A data analysis platform combining AI-powered insights with interactive visualizations for diverse datasets. Features dual AI assistants (rule-based and Claude-powered) for automated data analysis and visualization generation. Includes an extensive visualization system with 25+ chart types and custom dashboard builder functionality, optimized for large datasets through efficient memory management, caching, and intelligent sampling techniques.",
    media: {
      type: "image",
      src: "/projects/csv-ai-analytics.webp",
    },
    tags: ["Python", "Streamlit", "Plotly", "Pandas", "NumPy", "Claude API"],
    link: "",
    github: "https://github.com/Hemanthreddy410/csv-ai-analytics",
  },
  {
    id: 2,
    title: "ServiceNow CMDB Health Dashboard",
    description:
      "A comprehensive CMDB health monitoring dashboard using Performance Analytics, Dashboards, and custom scripting for enterprise-level visibility. Developed automated CMDB data quality checks, health audit rules, and remediation workflows that increased CMDB accuracy from 65% to 92% and maintained data integrity. Created custom indicators and KPIs to track CMDB completeness, compliance, relationship accuracy, and staleness with real-time visualization.",
    media: {
      type: "image",
      src: "/projects/servicenow-cmdb.webp",
    },
    tags: ["ServiceNow", "JavaScript", "Performance Analytics", "ITSM", "Dashboards"],
    link: "",
    github: "https://github.com/Hemanthreddy410/servicenow-cmdb-dashboard",
  },
  {
    id: 3,
    title: "Demand Forecasting Project",
    description:
      "Implemented demand forecasting utilizing historical Adidas outlet sales data, improving inventory planning by 22%. Explored and compared time series algorithms (exponential smoothing, SARIMA, Prophet, ARIMA) for prediction. Conducted comprehensive data preprocessing, ensuring data quality and converting insights into actionable strategies. Led hyperparameter tuning for exponential smoothing models, optimizing forecasting accuracy.",
    media: {
      type: "image",
      src: "/projects/demand-forecasting.webp",
    },
    tags: ["Python", "Pandas", "Scikit-learn", "Time Series Analysis", "Data Visualization"],
    link: "",
    github: "https://github.com/Hemanthreddy410/demand-forecasting",
  },
  {
    id: 4,
    title: "Pothole Detection System",
    description:
      "A robust automatic pothole detection system for image and video inputs with 85% accuracy. Implemented computer vision algorithms that enabled autonomous detection and prediction processes. Applied encryption and web scraping for secure and efficient data gathering from multiple sources. Designed an intuitive UI with Python's Tkinter, ensuring user-friendly interaction and visualization.",
    media: {
      type: "image",
      src: "/projects/pothole-detection.webp",
    },
    tags: ["Python", "OpenCV", "Tkinter", "Computer Vision", "Machine Learning"],
    link: "",
    github: "https://github.com/Hemanthreddy410/pothole-detection",
  },
];

// Function to extract YouTube video ID from URL
const extractYouTubeId = (url: string): string => {
  // Handle youtu.be format
  if (url.includes("youtu.be")) {
    return url.split("/").pop() || "";
  }

  // Handle youtube.com format
  const match = url.match(/[?&]v=([^&]+)/);
  if (match) return match[1];

  // Handle youtube.com/embed format
  const embedMatch = url.match(/youtube\.com\/embed\/([^/?]+)/);
  if (embedMatch) return embedMatch[1];

  // If it's already just an ID or we can't parse it, return as is
  return url;
};

// YouTube embed component with autoplay
const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  // Extract the video ID if a full URL was provided
  const id = extractYouTubeId(videoId);

  return (
    <div className="relative w-full aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`}
        className="absolute inset-0 w-full h-full rounded-t-xl"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

// Add this new constant for shared transition config
const transitionConfig = {
  type: "spring",
  bounce: 0.15,
  duration: 0.4,
};

export default function Projects() {
  // State to hold the currently selected project for the modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Add structured data for SEO
  useEffect(() => {
    // Create JSON-LD structured data for portfolio
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: SEO.title,
      description: SEO.description,
      keywords: SEO.keywords,
      mainEntity: {
        "@type": "Person",
        name: "Hemanth Reddy Yarraguravagari",
        url: "https://github.com/Hemanthreddy410",
        sameAs: [
          "https://github.com/Hemanthreddy410",
          "https://linkedin.com/in/hemanth-reddy",
          // Add other social profiles if available
        ],
      },
    };

    // Add structured data to the document
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Add effect to handle body scroll lock when modal is open
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to restore scroll on component unmount or modal close
    return () => {
      document.head.removeChild(script);
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]); // Re-run effect when selectedProject changes

  return (
    <>
      {/* Add SEO metadata */}
      <Head>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <meta name="keywords" content={SEO.keywords} />
        <meta property="og:title" content={SEO.title} />
        <meta property="og:description" content={SEO.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO.title} />
        <meta name="twitter:description" content={SEO.description} />
      </Head>

      <div
        id="projects-page"
        className="min-h-screen w-full text-white mt-10 relative z-10"
      >
        <div id="projects-container" className="max-w-7xl mx-auto px-4 py-8">
          <h1
            id="projects-title"
            className="text-4xl mb-10 text-center sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500"
          >
            Projects
          </h1>

          {/* Project Grid Layout */}
          <div
            id="projects-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                id={`project-card-${project.id}`}
                layoutId={`project-${project.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transitionConfig}
                className="bg-neutral-900 rounded-xl overflow-hidden shadow-lg flex flex-col h-full group cursor-pointer will-change-transform"
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Media */}
                <div
                  id={`project-media-${project.id}`}
                  className="relative w-full aspect-video overflow-hidden bg-neutral-950"
                >
                  {project.media.type === "image" ? (
                    <Image
                      src={project.media.src}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={index < 3}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <YouTubeEmbed videoId={project.media.src} />
                  )}
                </div>

                {/* Project Details */}
                <div
                  id={`project-details-${project.id}`}
                  className="p-4 sm:p-6 flex flex-col flex-grow"
                >
                  <h2
                    id={`project-title-${project.id}`}
                    className="text-lg sm:text-xl font-bold text-neutral-200 mb-2"
                  >
                    {project.title}
                  </h2>
                  <p
                    id={`project-description-${project.id}`}
                    className="text-sm text-neutral-400 leading-relaxed mb-3 flex-grow line-clamp-3"
                  >
                    {project.description}
                  </p>
                  <div
                    id={`project-tags-${project.id}`}
                    className="flex flex-wrap gap-2 mb-4"
                  >
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div
                    id={`project-links-${project.id}`}
                    className="flex flex-wrap gap-3 mt-auto"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.github, "_blank");
                      }}
                      className="flex items-center gap-2 text-white/80 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm"
                      aria-label={`View source code for ${project.title} on GitHub`}
                      title="View on GitHub"
                    >
                      <FiGithub className="w-4 h-4" />
                      <span>GitHub</span>
                    </button>
                    {project.link && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.link, "_blank");
                        }}
                        className="flex items-center gap-2 text-white/90 hover:text-white bg-blue-600/80 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm"
                        aria-label={`View live demo of ${project.title}`}
                        title="View Live Demo"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Projects Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-neutral-200 mb-8">
              Professional Contributions
            </h2>
            <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
              <p className="text-neutral-300 text-center max-w-3xl mx-auto">
                In addition to my personal projects, I've led significant enterprise-level implementations 
                including ETL/ELT pipelines processing 5TB+ daily data, ServiceNow customizations that 
                improved IT service delivery by 35%, and data warehouse solutions that enhanced query performance by 25%.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-800/50 p-4 rounded-lg">
                  <h3 className="text-blue-400 font-medium mb-2">Data Engineering</h3>
                  <p className="text-sm text-neutral-400">Designed and optimized ETL/ELT pipelines using AWS Glue, Python, and SQL with 99.9% data reliability.</p>
                </div>
                <div className="bg-neutral-800/50 p-4 rounded-lg">
                  <h3 className="text-blue-400 font-medium mb-2">ServiceNow Development</h3>
                  <p className="text-sm text-neutral-400">Implemented complex business rules, UI policies, and script includes to automate ITSM workflows across multiple instances.</p>
                </div>
                <div className="bg-neutral-800/50 p-4 rounded-lg">
                  <h3 className="text-blue-400 font-medium mb-2">Data Visualization</h3>
                  <p className="text-sm text-neutral-400">Created interactive business intelligence dashboards using Tableau and Excel that increased customer retention by 18%.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO-friendly footer section */}
          <footer className="mt-20 text-center text-sm text-neutral-600 hidden">
            <p>
              Portfolio showcasing data engineering, ServiceNow development, and software
              engineering projects by Hemanth Reddy Yarraguravagari.
            </p>
          </footer>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <motion.div
            id="project-modal-backdrop"
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8 mt-16"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              id={`project-modal-${selectedProject.id}`}
              layoutId={`project-${selectedProject.id}`}
              transition={transitionConfig}
              className="bg-neutral-900 rounded-xl overflow-hidden shadow-2xl w-full max-h-[85vh] max-w-5xl flex flex-col md:flex-row will-change-transform"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Media Section - Simplified */}
              <div className="relative w-full md:w-[65%] bg-neutral-950 flex items-center justify-center p-4 ">
                {selectedProject.media.type === "image" ? (
                  <Image
                    src={selectedProject.media.src}
                    alt={selectedProject.title}
                    width={1200}
                    height={675}
                    className="w-full h-auto object-contain rounded-lg"
                    priority
                    sizes="(max-width: 768px) 100vw, 65vw"
                  />
                ) : (
                  <div className="w-full aspect-video">
                    <YouTubeEmbed videoId={selectedProject.media.src} />
                  </div>
                )}
              </div>

              {/* Modal Content Section - Simplified */}
              <div className="p-6 md:p-8 overflow-y-auto md:w-[35%] flex flex-col bg-neutral-900">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-100 mb-6">
                  {selectedProject.title}
                </h2>

                <div className="space-y-6">
                  <p className="text-base text-neutral-300 leading-relaxed">
                    {selectedProject.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-sm rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() =>
                        window.open(selectedProject.github, "_blank")
                      }
                      className="flex items-center gap-2 text-white/90 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-5 py-2.5 rounded-lg transition-colors text-sm font-medium"
                    >
                      <FiGithub className="w-5 h-5" />
                      <span>GitHub</span>
                    </button>
                    {selectedProject.link && (
                      <button
                        onClick={() =>
                          window.open(selectedProject.link, "_blank")
                        }
                        className="flex items-center gap-2 text-white hover:text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg transition-colors text-sm font-medium"
                      >
                        <FiExternalLink className="w-5 h-5" />
                        <span>Live Demo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Button - Simplified */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject(null);
                }}
                className="absolute top-4 right-4 text-white/90 hover:text-white bg-black/50 hover:bg-black/60 rounded-full p-2.5 transition-colors z-10"
              >
                <FiX className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}