import express from "express";
import mongoose from "mongoose";
import redis from "redis";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Redis Connection
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.error("Redis connection error:", err));

// Sample Route
// Sample Route
app.get("/", async (req, res) => {
  try {
    const pong = await redisClient.ping();

    // Check MongoDB connection state
    const mongoState = mongoose.connection.readyState;

    // '1' means connected, '0' means disconnected, '2' means connecting, and '3' means disconnecting
    const mongoStatus =
      mongoState === 1 ? "Connected to MongoDB" : "MongoDB connection error";

    res.send({
      message: "Express with MongoDB and Redis is running!",
      redisPing: pong,
      mongoStatus: mongoStatus,
    });
  } catch (error) {
    res.status(500).send({ error: "Error pinging Redis or MongoDB" });
  }
});

// app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
