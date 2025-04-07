import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { AnthropicEmbeddings } from "langchain/embeddings/anthropic";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
// Import the character content from the character.ts file
import { characterContent } from "../components/character/character.js";

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

// Log environment variables (for debugging, remove in production)
console.log("PINECONE_API_KEY exists:", !!process.env.PINECONE_API_KEY);
console.log("ANTHROPIC_API_KEY exists:", !!process.env.ANTHROPIC_API_KEY);

// Initialize Claude embeddings
const getEmbeddings = () => {
  return new AnthropicEmbeddings({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    modelName: "claude-3-haiku-20240307", // Use appropriate Claude model
  });
};

// Helper function to split text into chunks
function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];

  // Split by sections first (double newlines)
  const sections = text.split(/\n\n+/);

  let currentChunk = "";

  for (const section of sections) {
    // If adding this section doesn't exceed chunk size
    if ((currentChunk + section).length <= chunkSize) {
      currentChunk += (currentChunk ? "\n\n" : "") + section;
    } else {
      // If current chunk is not empty, add it to chunks
      if (currentChunk) {
        chunks.push(currentChunk);
      }

      // If the section itself is too large, split it further
      if (section.length > chunkSize) {
        // Split by sentences
        const sentences = section.split(/(?<=[.!?])\s+/);
        let sectionChunk = "";

        for (const sentence of sentences) {
          if ((sectionChunk + sentence).length <= chunkSize) {
            sectionChunk += (sectionChunk ? " " : "") + sentence;
          } else {
            if (sectionChunk) {
              chunks.push(sectionChunk);
            }
            sectionChunk = sentence;
          }
        }

        if (sectionChunk) {
          chunks.push(sectionChunk);
        }
      } else {
        // Start a new chunk with current section
        currentChunk = section;
      }
    }
  }

  // Add the last chunk if not empty
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Main function to initialize the vector store
async function initializeVectorStore() {
  try {
    // Check if API keys are available
    if (!process.env.PINECONE_API_KEY) {
      throw new Error(
        "PINECONE_API_KEY is not defined in environment variables"
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not defined in environment variables");
    }

    console.log("API keys found, proceeding with initialization...");

    // Initialize Pinecone client with correct configuration
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // Split the character content into chunks
    const chunks = splitTextIntoChunks(characterContent, 500);
    console.log(`Created ${chunks.length} chunks from character content:`);

    // Log the first few characters of each chunk for verification
    chunks.forEach((chunk, i) => {
      console.log(`Chunk ${i + 1}: ${chunk.substring(0, 50)}...`);
    });

    // Create documents from chunks
    const documents = chunks.map(
      (chunk, i) =>
        new Document({
          pageContent: chunk,
          metadata: {
            source: "character",
            chunk: i,
            section: identifySection(chunk),
          },
        })
    );

    // Get or create the index
    const indexName = process.env.PINECONE_INDEX_NAME || "hemanth-portfolio";
    console.log(`Using index name: ${indexName}`);

    // List existing indexes
    const indexes = await pinecone.listIndexes();
    console.log("Available indexes:", indexes);

    const indexExists =
      indexes.indexes?.some((index) => index.name === indexName) || false;

    if (!indexExists) {
      console.log(`Creating index ${indexName}`);
      try {
        await pinecone.createIndex({
          name: indexName,
          dimension: 1536, // Claude embeddings dimension
          metric: "cosine",
          spec: {
            serverless: {
              cloud: "aws",
              region: "us-west-1", // Try a different region if this fails
            },
          },
        });

        // Wait for index initialization
        console.log("Waiting for index to initialize...");
        await new Promise((resolve) => setTimeout(resolve, 60000));
        console.log("Index initialization wait complete");
      } catch (error) {
        console.error(`Error creating index ${indexName}:`, error);

        // Try with a different region as fallback
        console.log("Attempting to create index with alternate region...");
        try {
          await pinecone.createIndex({
            name: indexName,
            dimension: 1536, // Claude embeddings dimension
            metric: "cosine",
            spec: {
              serverless: {
                cloud: "aws",
                region: "us-east-1", // Try a different region
              },
            },
          });
          console.log("Successfully created index with alternate region");

          // Wait for index initialization
          console.log("Waiting for index to initialize...");
          await new Promise((resolve) => setTimeout(resolve, 60000));
          console.log("Index initialization wait complete");
        } catch (secondError) {
          console.error(
            "Failed to create index with alternate region:",
            secondError as Error
          );
          throw new Error(
            `Could not create Pinecone index: ${(secondError as Error).message}`
          );
        }
      }
    } else {
      console.log(`Index ${indexName} already exists`);

      // Delete all existing vectors if index exists
      try {
        const index = pinecone.Index(indexName);
        console.log("Deleting existing vectors...");
        await index.deleteAll();
        console.log("Existing vectors deleted successfully");
      } catch (error) {
        console.error("Error deleting existing vectors:", error);
      }
    }

    // Get the index
    const index = pinecone.Index(indexName);

    // Create embeddings instance
    const embeddings = getEmbeddings();

    // Create and populate the vector store
    console.log("Creating vector store from documents...");
    const vectorStore = await PineconeStore.fromDocuments(
      documents,
      embeddings,
      {
        pineconeIndex: index,
        namespace: "character-info",
      }
    );

    console.log("Vector store initialized successfully");

    // Test a query to verify it works
    console.log("Testing a query...");
    const testQuery = "What are Hemanth's skills?";
    const results = await vectorStore.similaritySearch(testQuery, 2);
    console.log("Test query results:");
    results.forEach((result, i) => {
      console.log(
        `Result ${i + 1}: ${result.pageContent.substring(0, 100)}...`
      );
    });

    return vectorStore;
  } catch (error) {
    console.error("Error initializing vector store:", error);
    throw error;
  }
}

// Helper function to identify which section a chunk belongs to
function identifySection(chunk: string): string {
  const lowerChunk = chunk.toLowerCase();

  if (lowerChunk.includes("summary")) return "summary";
  if (lowerChunk.includes("experience")) return "experience";
  if (lowerChunk.includes("education")) return "education";
  if (lowerChunk.includes("projects")) return "projects";
  if (lowerChunk.includes("skills")) return "skills";
  if (lowerChunk.includes("certifications")) return "certifications";
  if (lowerChunk.includes("languages")) return "languages";
  if (lowerChunk.includes("hobbies")) return "hobbies";
  if (
    lowerChunk.includes("contact") ||
    lowerChunk.includes("email") ||
    lowerChunk.includes("phone")
  )
    return "contact";

  return "general";
}

// Run the initialization
async function main() {
  console.log("Starting vector store initialization...");
  try {
    await initializeVectorStore();
    console.log("Vector store initialization completed successfully!");
  } catch (error) {
    console.error("Failed to initialize vector store:", error);
  }
  process.exit(0);
}

main();