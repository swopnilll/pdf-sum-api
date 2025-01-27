import mongoose from "mongoose";

import Embedding from "../models/embedding.js";

export const saveEmbedding = async (serializableEmbeddings, documentName) => {
  const embedding = new Embedding({
    vectors: serializableEmbeddings.vectors,
    texts: serializableEmbeddings.texts,
    metadatas: serializableEmbeddings.metadatas,
    documentName: documentName,
  });

  await embedding.save();

  return embedding._id;
};

export const getEmbedding = async (id) => {
  return await Embedding.findById(id);
};

export const getAllEmbeddings = async () => {
  return await Embedding.find({}, "documentName createdAt");
};

export const deleteEmbedding = async (id) => {
  await Embedding.findByIdAndDelete(id);
};
