import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { loadDocument } from "../utils/pdfParser.js";
import { splitDocs } from "../utils/pdfParser.js";
import { getVectorStore } from "../services/vectorService.js";
import { getAnswer } from "../services/qaService.js";

import {
  saveEmbedding,
  deleteEmbedding,
  getAllEmbeddings,
  getEmbedding,
} from "../services/databaseService.js";

// Process Document (Load and Split)
const processDocument = async (filePath) => {
  try {
    // Load the document
    const docs = await loadDocument(filePath);

    // Split the document into chunks
    const chunks = await splitDocs(docs);

    // Generate vector embeddings for the chunks
    const vectorStore = await getVectorStore(chunks);

    const serializableData = {
      vectors: vectorStore.memoryVectors,
      texts: chunks.map((chunk) => chunk.pageContent),
      metadatas: chunks.map((chunk) => chunk.metadata),
    };

    return serializableData;
  } catch (error) {
    console.error("Error processing document:", error);
    throw new Error("Error processing document");
  }
};

// Send Response
export const sendResponse = (res, message, data = null) => {
  res.status(200).json({
    message,
    data,
  });
};

// Main upload handler
export const uploadDocument = async (req, res) => {
  try {
    // Process the document (load and split)
    const serializableEmbeddings = await processDocument(req.file.path);

    console.log(serializableEmbeddings);

    const embeddingId = await saveEmbedding(
      serializableEmbeddings,
      req.file.originalname
    );

    // Send a success response
    sendResponse(
      res,
      "Document uploaded and processed successfully",
      embeddingId
    );
  } catch (error) {
    console.error("Error processing document:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const listDocuments = async (req, res) => {
  try {
    const documents = await getAllEmbeddings();
    res.json(
      documents.map((doc) => ({
        id: doc._id,
        name: doc.documentName,
        createdAt: doc.createdAt,
      }))
    );
  } catch (error) {
    console.error("Error listing documents:", error);
    res.status(500).json({ error: "Error listing documents" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteEmbedding(id);
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Error deleting document" });
  }
};

export const askQuestion = async (req, res) => {
  try {
    const { question, embeddingId } = req.body;

    console.log({ question, embeddingId });

    if (!question || !embeddingId) {
      return res
        .status(400)
        .json({ error: "Question and embeddingId are required" });
    }

    const storedEmbedding = await getEmbedding(embeddingId);

    console.log({ storedEmbedding });

    if (!storedEmbedding) {
      return res.status(404).json({ error: "Embedding not found" });
    }

    const embeddings = new OpenAIEmbeddings({
      openaiApiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await MemoryVectorStore.fromTexts(
      storedEmbedding.texts,
      storedEmbedding.metadatas,
      embeddings
    );

    const answer = await getAnswer(question, vectorStore);
    res.json({ answer });
  } catch (error) {
    console.error("Error answering question:", error);
    res.status(500).json({ error: "Error answering question" });
  }
};
