import { createClient } from "redis";
const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("connect", () => {
  console.log(` Redis connected successfully at ${process.env.REDIS_URL}`);
});

await redis.connect();

export default redis;
