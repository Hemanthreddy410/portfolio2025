"use client";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiServicenow } from "react-icons/si";
import { MdEmail } from "react-icons/md";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-800 relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4 ">
          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="https://github.com/Hemanthreddy410"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-blue-500 transition-colors"
              aria-label="GitHub Profile"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://linkedin.com/in/hemanth-reddy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-blue-500 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="mailto:hemanth.yarraguravagari@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-blue-500 transition-colors"
              aria-label="Email"
            >
              <MdEmail size={20} />
            </a>
            <a
              href="https://developer.servicenow.com/connect.do"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-blue-500 transition-colors"
              aria-label="ServiceNow Developer"
            >
              <SiServicenow size={20} />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-neutral-500 text-sm">
            <p>© {currentYear} Hemanth Reddy Yarraguravagari</p>
          </div>
        </div>
      </div>
    </footer>
  );
}