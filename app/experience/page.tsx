import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { FiMapPin, FiAward, FiBriefcase, FiBook } from "react-icons/fi";

export default function ExperiencePage() {
  const data = [
    {
      title: "2023-2025",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <FiBook className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold">Master of Computer and Information Sciences</h3>
              <div className="flex items-center gap-2 text-neutral-400 text-sm mt-1">
                <FiMapPin className="w-4 h-4" />
                <span>Florida International University, Miami, FL, USA</span>
              </div>
            </div>
          </div>

          <div className="pl-7">
            <p className="text-neutral-300 text-sm leading-relaxed">
              Pursuing Master's degree with a GPA of 3.85/4.0, focusing on advanced database systems, 
              machine learning, artificial intelligence, and advanced software engineering. 
              Developing expertise in data engineering and AI implementations through rigorous 
              coursework and practical projects.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "May 2024 - Present",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <FiBriefcase className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold">Graduate Assistant – Logics for Computer Science</h3>
              <div className="flex items-center gap-2 text-neutral-400 text-sm mt-1">
                <span className="font-medium">Florida International University</span>
                <span>•</span>
                <span>Miami, FL</span>
              </div>
            </div>
          </div>

          <div className="pl-7">
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="leading-relaxed">
                Supporting academic excellence by assisting professors and students in computer science logic courses.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>
                    Support the professor by creating assignments and leading classes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>Provide academic assistance to enhance students' understanding of logical reasoning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>Develop instructional materials to facilitate classroom learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>Conduct office hours to provide additional support on complex logical concepts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Feb 2022 - Aug 2023",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <FiBriefcase className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold">Software Engineer</h3>
              <div className="flex items-center gap-2 text-neutral-400 text-sm mt-1">
                <span className="font-medium">DXC Technology</span>
                <span>•</span>
                <span>Bangalore, India</span>
              </div>
            </div>
          </div>

          <div className="pl-7">
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="leading-relaxed">
                Led dual roles as Data Engineer and ServiceNow Developer, supporting enterprise-level implementations 
                for clients with cross-functional responsibilities.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>
                    Designed ETL/ELT pipelines using AWS Glue, Python, and SQL that processed over 5TB of data daily
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>Developed custom ServiceNow applications resulting in 35% improvement in IT service delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>Architected data warehouse solutions on AWS Redshift, implementing star/snowflake schemas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>Created secure REST/SOAP integrations between ServiceNow and third-party systems</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "May 2020 - Jan 2022",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <FiBriefcase className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold">Data Analyst</h3>
              <div className="flex items-center gap-2 text-neutral-400 text-sm mt-1">
                <span className="font-medium">SALIGRAM TECHNOLOGIES PRIVATE LIMITED</span>
                <span>•</span>
                <span>Hyderabad, India</span>
              </div>
            </div>
          </div>

          <div className="pl-7">
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="leading-relaxed">
                Built and maintained data infrastructure while delivering actionable insights through 
                visualization and analysis.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>
                    Built scalable data pipelines using Python, SQL, Apache Airflow, and Kafka
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>Developed interactive BI dashboards using Tableau and Excel that increased customer retention by 18%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>Engineered automated data preprocessing workflows with Python (Pandas, NumPy, Scikit-learn)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▹</span>
                  <span>Implemented data lake architecture on AWS S3 improving data retrieval speeds by 30%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Certifications",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <FiAward className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">Professional Certifications</h3>
          </div>

          <div className="pl-7 space-y-6 ">
            {/* ServiceNow Certifications */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400" />
                <h4 className="text-white font-medium">ServiceNow Certifications</h4>
              </div>
              <div className="pl-5">
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Achieved multiple professional certifications validating expertise in ServiceNow platform
                  implementation, administration, and development.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                    System Administrator
                  </span>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                    Application Developer
                  </span>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                    Implementation Specialist (ITSM)
                  </span>
                </div>
              </div>
            </div>

            {/* AWS Certification */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400" />
                <h4 className="text-white font-medium">AWS Certification</h4>
              </div>
              <div className="pl-5">
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Earned the{" "}
                  <span className="text-blue-400 font-medium">
                    AWS Certified Solutions Architect – Professional
                  </span>{" "}
                  certification, demonstrating advanced expertise in designing distributed systems
                  on AWS and implementing complex cloud architectures.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                    Professional Level
                  </span>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                    Cloud Architecture
                  </span>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                    AWS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full ">
      <Timeline data={data} />
    </div>
  );
}