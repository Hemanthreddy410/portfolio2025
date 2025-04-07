/* eslint-disable */
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { MemorySaver } from "@langchain/langgraph";
import { queryVectorStore } from "@/lib/embeddings";

// Add CORS check middleware
function isAllowedOrigin(origin: string | null) {
  const allowedOrigins = [
    "https://hemanthyarraguravagari.xyz",
    "https://www.hemanthyarraguravagari.xyz",

    // Include localhost for development(uncomment for development)
    // "http://localhost:3000",
  ];
  return origin && allowedOrigins.includes(origin);
}

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();

// Function to detect if a message likely needs web search - optimized with Set for faster lookups
function needsWebSearch(message: string): boolean {
  const searchIndicators = new Set([
    "current",
    "latest",
    "recent",
    "news",
    "today",
    "update",
    "weather",
    "price",
    "stock",
    "event",
    "happened",
    "when did",
    "when will",
    "how much is",
    "what is the",
    "who is",
    "where is",
    "2023",
    "2024",
    "2025",
    "servicenow",
    "etl",
    "data engineering",
    "aws",
    "azure",
    "search",
    "claude",
  ]);

  const lowerMessage = message.toLowerCase();
  return Array.from(searchIndicators).some((indicator) =>
    lowerMessage.includes(indicator.toLowerCase())
  );
}

// Function to detect query type - optimized with regex patterns stored as constants
const SKILLS_PATTERN =
  /skills|technologies|tech stack|programming|languages|frameworks|tools|libraries|proficient|expertise|capable|abilities/i;
const PROJECTS_PATTERN =
  /projects|portfolio|work|applications|apps|websites|developed|built|created|made|showcase|csv ai|servicenow|demand forecasting|pothole detection/i;
const EXPERIENCE_PATTERN =
  /experience|work history|job|career|background|employment|company|dxc|saligram|position|role/i;
const EDUCATION_PATTERN =
  /education|degree|university|college|school|academic|study|studied|florida|international|master|computer|information/i;
const CONTACT_PATTERN =
  /contact|email|phone|reach|get in touch|connect|social media|linkedin|github|twitter|message|call/i;
const CERTIFICATIONS_PATTERN =
  /certifications|certified|certificate|credentials|qualifications|aws|servicenow|system administrator|application developer|implementation specialist|solutions architect/i;
const LINKS_PATTERN =
  /links|urls|websites|resources|portfolio|resume|github|linkedin|social|profiles|connect|follow|check out|visit/i;

// Add more specific patterns for individual link types
const RESUME_PATTERN = /resume|cv|curriculum vitae/i;
const GITHUB_PATTERN = /github|code|repository|repositories|source code/i;
const LINKEDIN_PATTERN = /linkedin|professional profile|professional network/i;
const PORTFOLIO_PATTERN = /portfolio website|personal website|portfolio site/i;
const PROJECT_LINKS_PATTERN =
  /project links|project urls|project websites|project github/i;

// Add more specific patterns for individual contact types
const EMAIL_PATTERN =
  /email|e-mail|mail|send.*email|send.*mail|electronic mail/i;
const PHONE_PATTERN = /phone|call|mobile|cell|telephone|contact number/i;
const LOCATION_PATTERN =
  /location|address|where.*live|where.*based|city|town|where.*from/i;

// Add specific patterns for individual projects
const CSV_AI_PATTERN =
  /csv ai|analytics|streamlit|plotly|claude|data analysis|visualization/i;
const SERVICENOW_PATTERN =
  /servicenow|cmdb|health dashboard|performance analytics|dashboards/i;
const DEMAND_PATTERN =
  /demand forecasting|adidas|sales data|inventory planning|time series|sarima|prophet|arima/i;
const POTHOLE_PATTERN =
  /pothole detection|opencv|tkinter|computer vision|detection system/i;

// Update the detectQueryType function to handle specific project types
function detectQueryType(message: string): string | null {
  const lowerMessage = message.toLowerCase();

  // Check for specific project types
  if (
    CSV_AI_PATTERN.test(lowerMessage) &&
    !SERVICENOW_PATTERN.test(lowerMessage) &&
    !DEMAND_PATTERN.test(lowerMessage) &&
    !POTHOLE_PATTERN.test(lowerMessage)
  )
    return "csv_ai_project";
  if (
    SERVICENOW_PATTERN.test(lowerMessage) &&
    !CSV_AI_PATTERN.test(lowerMessage) &&
    !DEMAND_PATTERN.test(lowerMessage) &&
    !POTHOLE_PATTERN.test(lowerMessage)
  )
    return "servicenow_project";
  if (
    DEMAND_PATTERN.test(lowerMessage) &&
    !CSV_AI_PATTERN.test(lowerMessage) &&
    !SERVICENOW_PATTERN.test(lowerMessage) &&
    !POTHOLE_PATTERN.test(lowerMessage)
  )
    return "demand_forecasting_project";
  if (
    POTHOLE_PATTERN.test(lowerMessage) &&
    !CSV_AI_PATTERN.test(lowerMessage) &&
    !SERVICENOW_PATTERN.test(lowerMessage) &&
    !DEMAND_PATTERN.test(lowerMessage)
  )
    return "pothole_detection_project";

  // Check for specific contact types
  if (
    EMAIL_PATTERN.test(lowerMessage) &&
    !PHONE_PATTERN.test(lowerMessage) &&
    !LOCATION_PATTERN.test(lowerMessage)
  )
    return "email_contact";
  if (PHONE_PATTERN.test(lowerMessage) && !EMAIL_PATTERN.test(lowerMessage))
    return "phone_contact";
  if (LOCATION_PATTERN.test(lowerMessage)) return "location_contact";

  // Check for specific link types
  if (
    RESUME_PATTERN.test(lowerMessage) &&
    !lowerMessage.includes("skills") &&
    !lowerMessage.includes("experience")
  )
    return "resume_link";
  if (GITHUB_PATTERN.test(lowerMessage) && !lowerMessage.includes("projects"))
    return "github_link";
  if (LINKEDIN_PATTERN.test(lowerMessage)) return "linkedin_link";
  if (PORTFOLIO_PATTERN.test(lowerMessage)) return "portfolio_link";
  if (PROJECT_LINKS_PATTERN.test(lowerMessage)) return "project_links";

  // Then check for general categories
  if (SKILLS_PATTERN.test(lowerMessage)) return "skills";
  if (PROJECTS_PATTERN.test(lowerMessage)) return "projects";
  if (EXPERIENCE_PATTERN.test(lowerMessage)) return "experience";
  if (EDUCATION_PATTERN.test(lowerMessage)) return "education";
  if (CONTACT_PATTERN.test(lowerMessage)) return "contact";
  if (CERTIFICATIONS_PATTERN.test(lowerMessage)) return "certifications";
  if (LINKS_PATTERN.test(lowerMessage)) return "links";

  return null;
}

// Define types for OpenRouter API
interface OpenRouterMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface OpenRouterFields {
  temperature?: number;
  [key: string]: unknown;
}

// Create a custom OpenRouter-based model
class OpenRouterChatModel extends ChatOpenAI {
  private isSearchQuery: boolean;

  constructor(fields: OpenRouterFields, isSearchQuery: boolean = false) {
    super(fields);
    this.isSearchQuery = isSearchQuery;
  }

  async _generate(messages: BaseMessage[], _options: ChatOpenAICallOptions) {
    // Format messages for OpenRouter
    const formattedMessages: OpenRouterMessage[] = messages.map((msg) => ({
      role:
        msg._getType() === "human"
          ? "user"
          : msg._getType() === "system"
          ? "system"
          : "assistant",
      content: msg.content as string,
    }));

    // Check if the last message is from a human and might need search
    const lastMessage = formattedMessages[formattedMessages.length - 1];
    if (lastMessage.role === "user" && this.isSearchQuery) {
      try {
        // Perform a search directly
        const searchTool = new TavilySearchResults({
          maxResults: 3,
          apiKey: process.env.TAVILY_API_KEY,
        });
        const searchResults = await searchTool.invoke(lastMessage.content);

        // Add search results as a system message
        formattedMessages.splice(formattedMessages.length - 1, 0, {
          role: "system",
          content: `Relevant web search results that might help with the user's question:\n${searchResults}\n\nUse these results if they're helpful for answering the question.`,
        });
      } catch (error) {
        console.error("Error performing search:", error);
        // Continue without search results if there's an error
      }
    }

    try {
      // Make direct API call to OpenRouter
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://hemanthyarraguravagari.xyz",
            "X-Title": "Hemanth's Portfolio",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-maverick:free", // Using Llama 4 Maverick
            messages: formattedMessages,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenRouter API error:", errorData);
        throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();

      // Format the response to match what LangChain expects
      return {
        generations: [
          {
            text: data.choices[0].message.content,
            message: new AIMessage({
              content: data.choices[0].message.content,
            }),
          },
        ],
      };
    } catch (error) {
      console.error("Error calling OpenRouter:", error);
      throw error;
    }
  }
}

// Define the type for chat history messages
interface ChatMessage {
  type: "user" | "assistant";
  content: string;
}

// Simple in-memory cache for vector search results
const vectorSearchCache = new Map<string, string>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Update the generateStructuredResponse function to handle specific project types
function generateStructuredResponse(queryType: string): string {
  // Define individual project templates
  const projectTemplates: Record<string, any> = {
    csv_ai_project: [
      {
        title: "CSV AI Analytics",
        description: "A data analysis platform combining AI-powered insights with interactive visualizations for diverse datasets.",
        technologies: ["Python", "Streamlit", "Plotly", "Pandas", "NumPy", "Claude API"],
        period: "Jan 2025 - Mar 2025"
      },
    ],
    servicenow_project: [
      {
        title: "ServiceNow CMDB Health Dashboard",
        description: "A comprehensive CMDB health monitoring dashboard using Performance Analytics, Dashboards, and custom scripting for enterprise-level visibility.",
        technologies: ["ServiceNow", "Performance Analytics", "JavaScript", "Dashboards"],
        period: "Aug 2022 - Dec 2022"
      },
    ],
    demand_forecasting_project: [
      {
        title: "Demand Forecasting Project",
        description: "Implemented demand forecasting utilizing historical Adidas outlet sales data, improving inventory planning by 22%.",
        technologies: ["Python", "Pandas", "Scikit-learn", "Time Series Analysis"],
        period: "Aug 2023 - Dec 2023"
      },
    ],
    pothole_detection_project: [
      {
        title: "Pothole Detection System",
        description: "A robust automatic pothole detection system for image and video inputs with 85% accuracy.",
        technologies: ["Python", "OpenCV", "Tkinter", "Computer Vision"],
        period: "Aug 2023 - Dec 2023"
      },
    ],
  };

  // Define individual contact templates
  const contactTemplates: Record<string, any> = {
    email_contact: {
      email: "hemanth.yarraguravagari@gmail.com",
      type: "Email",
    },
    phone_contact: {
      phone: "+1 786-678-1043",
      type: "Phone",
    },
    location_contact: {
      location: "Miami, FL, USA",
      type: "Location",
    },
  };

  // Define individual link templates
  const linkTemplates: Record<string, any> = {
    resume_link: [
      {
        title: "Resume",
        url: "https://hemanthyarraguravagari.xyz/resume",
        description: "View my detailed resume with skills, experience, and education",
      },
    ],
    github_link: [
      {
        title: "GitHub Profile",
        url: "https://github.com/Hemanthreddy410",
        description: "Check out my code repositories and projects",
      },
    ],
    linkedin_link: [
      {
        title: "LinkedIn Profile",
        url: "https://linkedin.com/in/hemanth-reddy",
        description: "Connect with me professionally on LinkedIn",
      },
    ],
    portfolio_link: [
      {
        title: "Portfolio Website",
        url: "https://hemanthyarraguravagari.xyz",
        description: "My personal portfolio showcasing projects and skills",
      },
    ],
    project_links: [
      {
        title: "CSV AI Analytics",
        url: "https://github.com/Hemanthreddy410/csv-ai-analytics",
        description: "Data analysis platform with AI-powered insights",
      },
      {
        title: "ServiceNow CMDB Health Dashboard",
        url: "https://github.com/Hemanthreddy410/servicenow-cmdb-dashboard",
        description: "CMDB health monitoring dashboard",
      },
      {
        title: "Demand Forecasting Project",
        url: "https://github.com/Hemanthreddy410/demand-forecasting",
        description: "Forecasting model for inventory planning",
      },
      {
        title: "Pothole Detection System",
        url: "https://github.com/Hemanthreddy410/pothole-detection",
        description: "Computer vision system for pothole detection",
      },
    ],
  };

  // Define the structured data templates for general categories
  const structuredDataTemplates: Record<string, any> = {
    skills: [
      { name: "Python (Advanced)", category: "Programming Language" },
      { name: "JavaScript", category: "Programming Language" },
      { name: "SQL (Advanced)", category: "Database" },
      { name: "Java", category: "Programming Language" },
      { name: "ServiceNow", category: "Platform" },
      { name: "ETL/ELT Pipeline Development", category: "Data Engineering" },
      { name: "Data Modeling", category: "Data Engineering" },
      { name: "Data Warehousing", category: "Data Engineering" },
      { name: "AWS (S3, EC2, AWS Glue, Redshift, Lambda)", category: "Cloud" },
      { name: "Azure (Data Factory, Synapse Analytics)", category: "Cloud" },
      { name: "Apache Spark", category: "Big Data" },
      { name: "Apache Airflow", category: "Workflow Management" },
      { name: "Pandas, NumPy, Scikit-learn", category: "Data Science" },
      { name: "Tableau, Power BI", category: "BI & Analytics" },
      { name: "CI/CD, Docker, Kubernetes", category: "DevOps" },
    ],
    projects: [
      {
        title: "CSV AI Analytics",
        description: "A data analysis platform combining AI-powered insights with interactive visualizations for diverse datasets.",
        technologies: ["Python", "Streamlit", "Plotly", "Pandas", "NumPy", "Claude API"],
        period: "Jan 2025 - Mar 2025"
      },
      {
        title: "ServiceNow CMDB Health Dashboard",
        description: "A comprehensive CMDB health monitoring dashboard using Performance Analytics, Dashboards, and custom scripting for enterprise-level visibility.",
        technologies: ["ServiceNow", "Performance Analytics", "JavaScript", "Dashboards"],
        period: "Aug 2022 - Dec 2022"
      },
      {
        title: "Demand Forecasting Project",
        description: "Implemented demand forecasting utilizing historical Adidas outlet sales data, improving inventory planning by 22%.",
        technologies: ["Python", "Pandas", "Scikit-learn", "Time Series Analysis"],
        period: "Aug 2023 - Dec 2023"
      },
      {
        title: "Pothole Detection System",
        description: "A robust automatic pothole detection system for image and video inputs with 85% accuracy.",
        technologies: ["Python", "OpenCV", "Tkinter", "Computer Vision"],
        period: "Aug 2023 - Dec 2023"
      },
    ],
    experience: [
      {
        title: "Software Engineer",
        company: "DXC Technology",
        location: "Bangalore, India",
        period: "Feb 2022 - Aug 2023",
        description: "Led dual roles as Data Engineer and ServiceNow Developer, supporting enterprise-level implementations for clients with cross-functional responsibilities. Designed ETL/ELT pipelines, developed custom ServiceNow applications, and optimized data warehouse solutions."
      },
      {
        title: "Data Analyst",
        company: "SALIGRAM TECHNOLOGIES PRIVATE LIMITED",
        location: "Hyderabad, India",
        period: "May 2020 - Jan 2022",
        description: "Built scalable data pipelines, developed BI dashboards, engineered automated data preprocessing workflows, and implemented data lake architecture on AWS S3."
      },
      {
        title: "Graduate Assistant – Logics for Computer Science",
        company: "Florida International University",
        location: "Miami, FL",
        period: "May 2024 - Present",
        description: "Support professor by creating assignments, leading classes, and providing academic assistance to enhance students' understanding of logical reasoning and problem-solving."
      },
    ],
    education: [
      {
        title: "Master of Computer and Information Sciences",
        institution: "Florida International University",
        location: "Miami, FL, USA",
        period: "Aug 2023 - May 2025",
        description: "GPA: 3.85/4.0. Coursework: Advanced Database Systems, Machine Learning, Artificial Intelligence, Database Management Systems, Algorithms, Advanced Software Engineering"
      }
    ],
    contact: {
      email: "hemanth.yarraguravagari@gmail.com",
      phone: "+1 786-678-1043",
      location: "Miami, FL, USA",
      linkedin: "https://linkedin.com/in/hemanth-reddy",
      github: "https://github.com/Hemanthreddy410"
    },
    certifications: [
      {
        title: "ServiceNow Certified System Administrator",
        issuer: "ServiceNow",
        description: "Professional certification validating expertise in ServiceNow system administration."
      },
      {
        title: "ServiceNow Certified Application Developer",
        issuer: "ServiceNow",
        description: "Professional certification validating expertise in developing applications on the ServiceNow platform."
      },
      {
        title: "Certified Implementation Specialist (ITSM)",
        issuer: "ServiceNow",
        description: "Professional certification validating expertise in implementing ServiceNow ITSM solutions."
      },
      {
        title: "AWS Certified Solutions Architect – Professional",
        issuer: "Amazon Web Services",
        description: "Professional certification validating expertise in designing distributed systems on AWS."
      }
    ],
    links: [
      {
        title: "LinkedIn Profile",
        url: "https://linkedin.com/in/hemanth-reddy",
        description: "Connect with me professionally"
      },
      {
        title: "GitHub Profile",
        url: "https://github.com/Hemanthreddy410",
        description: "Check out my code repositories"
      },
      {
        title: "Email",
        url: "mailto:hemanth.yarraguravagari@gmail.com",
        description: "Contact me via email"
      },
      {
        title: "CSV AI Analytics",
        url: "https://github.com/Hemanthreddy410/csv-ai-analytics",
        description: "Data analysis platform with AI-powered insights"
      },
      {
        title: "ServiceNow CMDB Health Dashboard",
        url: "https://github.com/Hemanthreddy410/servicenow-cmdb-dashboard",
        description: "CMDB health monitoring dashboard"
      }
    ],
  };

  // Check if it's a specific project type
  if (queryType.includes("_project")) {
    return JSON.stringify(
      {
        type: "projects",
        data: projectTemplates[queryType],
      },
      null,
      2
    );
  }

  // Check if it's a specific contact type
  if (queryType.includes("_contact")) {
    return JSON.stringify(
      {
        type: "contact",
        data: contactTemplates[queryType],
      },
      null,
      2
    );
  }

  // Check if it's a specific link type
  if (queryType.includes("_link")) {
    return JSON.stringify(
      {
        type: "links",
        data: linkTemplates[queryType],
      },
      null,
      2
    );
  }

  // Otherwise return the general category data
  return JSON.stringify(
    {
      type: queryType,
      data: structuredDataTemplates[queryType],
    },
    null,
    2
  );
}

export async function POST(req: Request) {
  // Performance monitoring
  const startTime = performance.now();

  // Check origin
  const headersList = await headers();
  const origin = headersList.get("origin");

  // If origin is not allowed, return 403 Forbidden
  if (!isAllowedOrigin(origin)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized origin" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const {
      prompt,
      messages: chatHistory,
      sessionId,
    } = (await req.json()) as {
      prompt: string;
      messages: ChatMessage[];
      sessionId?: string;
    };

    console.log("Received request with prompt:", prompt);

    // Check if the prompt likely needs web search
    const isSearchQuery = needsWebSearch(prompt);

    // Detect query type for structured response
    const queryType = detectQueryType(prompt);

    // Create a model with the search flag
    const model = new OpenRouterChatModel(
      {
        temperature: 0,
      },
      isSearchQuery
    );

    // Define the function that calls the model with context
    async function callModel(state: typeof MessagesAnnotation.State) {
      try {
        // Get the last user message to use for vector search
        const lastUserMessage = state.messages
          .filter((msg) => msg._getType() === "human")
          .pop();

        const userQuery = lastUserMessage
          ? (lastUserMessage.content as string)
          : "";

        // Detect if this is a query that will have structured data
        const willHaveStructuredData = !!queryType;

        // Optimization: Use cached vector search results if available
        let characterInfo = "";
        const cacheKey = `vector_search_${userQuery.slice(0, 50)}`;

        if (vectorSearchCache.has(cacheKey)) {
          console.log("Using cached vector search results");
          characterInfo = vectorSearchCache.get(cacheKey)!;
        } else {
          try {
            // Retrieve relevant character information using vector search
            console.time("Vector search");

            // Adjust number of results based on query complexity
            const k = userQuery.length > 50 ? 4 : 3;
            const relevantInfo = await queryVectorStore(userQuery, k);

            console.timeEnd("Vector search");

            characterInfo = relevantInfo
              .map((doc) => doc.pageContent)
              .join("\n\n");

            // Cache the results
            vectorSearchCache.set(cacheKey, characterInfo);

            // Set expiration for cache entry
            setTimeout(() => {
              vectorSearchCache.delete(cacheKey);
            }, CACHE_TTL);
          } catch (error) {
            console.error("Vector search failed, using fallback:", error);
            // Fallback to empty string if vector search fails
            characterInfo = "";
          }
        }

        // Modify system prompt based on whether structured data will be added
        let systemContent = `You are Hemanth Reddy Yarraguravagari, a versatile Software Engineer with expertise in data engineering, ServiceNow development, and software applications.`;

        if (willHaveStructuredData) {
          // For queries that will have structured data, instruct the model to be brief
          systemContent += ` For this query, provide a VERY BRIEF conversational introduction only. DO NOT list specific details like skills, projects, contact info, or links - these will be displayed separately in a structured format. Keep your response to 1-2 sentences maximum.`;
        } else {
          // For queries without structured data, allow normal detailed responses
          systemContent += ` Keep responses concise and use "I" statements.`;
        }

        // Only include character info if we have it
        if (characterInfo) {
          systemContent += `\n\nRelevant information about me:\n${characterInfo}`;
        }

        // Add specific instructions based on query type
        if (queryType && queryType.includes("_project")) {
          const projectName = queryType
            .replace("_project", "")
            .replace("_", " ");
          systemContent += `\n\nThis question is about my ${projectName} project. Just provide a brief introduction - the details will be shown in a structured format.`;
        } else if (queryType && queryType.includes("_contact")) {
          const contactType = queryType.replace("_contact", "");
          systemContent += `\n\nThis question is about my ${contactType}. Just acknowledge the request - the actual ${contactType} will be shown in a structured format.`;
        } else if (queryType && queryType.includes("_link")) {
          const linkType = queryType.replace("_link", "");
          systemContent += `\n\nThis question is about my ${linkType} link. Just acknowledge the request - the actual link will be shown in a structured format.`;
        } else if (queryType === "skills") {
          systemContent += `\n\nThis question is about my skills. Just provide a brief introduction - the detailed skills list will be shown in a structured format.`;
        } else if (queryType === "projects") {
          systemContent += `\n\nThis question is about my projects. Just provide a brief introduction - the detailed project list will be shown in a structured format.`;
        } else if (queryType === "experience") {
          systemContent += `\n\nThis question is about my experience. Just provide a brief introduction - the detailed experience will be shown in a structured format.`;
        } else if (queryType === "education") {
          systemContent += `\n\nThis question is about my education. Just provide a brief introduction - the detailed education info will be shown in a structured format.`;
        } else if (queryType === "contact") {
          systemContent += `\n\nThis question is about my contact information. Just acknowledge the request - the actual contact details will be shown in a structured format.`;
        } else if (queryType === "certifications") {
          systemContent += `\n\nThis question is about my certifications. Just provide a brief introduction - the detailed certification info will be shown in a structured format.`;
        } else if (queryType === "links") {
          systemContent += `\n\nThis question is about my online profiles and resources. Just acknowledge the request - the actual links will be shown in a structured format.`;
        } else if (queryType) {
          systemContent += `\n\nThis question is about my ${queryType}. Just provide a brief introduction - the details will be shown in a structured format.`;
        }

        systemContent += `\n\nRules:
        1. Speak as Hemanth using "I" and "my"
        2. Keep responses concise and focused
        3. If unsure about specific details, say "Feel free to contact me directly for more information"
        4. Use web search results when provided for up-to-date information
        5. Maintain a professional tone`;

        // Manage system message efficiently
        if (
          state.messages.length === 0 ||
          !(state.messages[0] instanceof SystemMessage)
        ) {
          state.messages.unshift(new SystemMessage(systemContent));
        } else {
          // Replace the existing system message with the updated one
          state.messages[0] = new SystemMessage(systemContent);
        }

        // Performance monitoring for model generation
        console.time("Model generation");
        const response = await model._generate(state.messages, {});
        console.timeEnd("Model generation");

        // Return the response
        return { messages: [response.generations[0].message] };
      } catch (error) {
        console.error("Error in callModel:", error);
        // Return a fallback message
        return {
          messages: [
            new AIMessage(
              "I'm sorry, I encountered an error processing your request. Please try again later."
            ),
          ],
        };
      }
    }

    // Define a new graph
    const workflow = new StateGraph(MessagesAnnotation)
      .addNode("agent", callModel)
      .addEdge("__start__", "agent")
      .addEdge("agent", "__end__");

    // Compile it into a LangChain Runnable with the checkpointer
    const app = workflow.compile({
      checkpointer: agentCheckpointer,
    });

    // Convert chat history to the format expected by LangGraph
    const formattedMessages = chatHistory
      ? chatHistory.map((msg: ChatMessage) =>
          msg.type === "user"
            ? new HumanMessage(msg.content)
            : new AIMessage(msg.content)
        )
      : [];

    // Add the current prompt as a human message
    formattedMessages.push(new HumanMessage(prompt));

    // Generate a thread ID for this conversation
    // Use the provided sessionId or generate a new one
    const threadId = sessionId || Date.now().toString();

    // Use the agent
    console.log("Invoking agent workflow with thread ID:", threadId);
    const finalState = await app.invoke(
      { messages: formattedMessages },
      { configurable: { thread_id: threadId } }
    );
    console.log("Agent workflow completed");

    // Get the last message (the response)
    let response = finalState.messages[finalState.messages.length - 1]
      .content as string;

    // If we have a query type, append the structured data JSON to the response
    let hasStructuredData = false;
    if (queryType) {
      const structuredData = generateStructuredResponse(queryType);
      response += `\n\n\`\`\`json\n${structuredData}\n\`\`\``;
      hasStructuredData = true;
    }

    // Performance monitoring
    const endTime = performance.now();
    console.log(
      `Total request processing time: ${(endTime - startTime).toFixed(2)}ms`
    );

    // Return response with CORS headers and include isSearchPerformed flag and threadId
    return new NextResponse(
      JSON.stringify({
        response,
        isSearchPerformed: isSearchQuery,
        hasStructuredData: hasStructuredData,
        structuredDataType: queryType,
        sessionId: threadId,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Chat API Error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const headersList = headers();
  const origin = (await headersList).get("origin");

  if (!isAllowedOrigin(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": origin || "",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}