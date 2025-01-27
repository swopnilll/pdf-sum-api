import mongoose from "mongoose";

// Define the embedding schema
const embeddingSchema = new mongoose.Schema({
  vectors: { type: [mongoose.Schema.Types.Mixed], required: true },
  texts: { type: [String], required: true },
  metadatas: { type: [mongoose.Schema.Types.Mixed], required: true },
  documentName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the model for embeddings
const Embedding = mongoose.model("Embedding", embeddingSchema);

export default Embedding;
