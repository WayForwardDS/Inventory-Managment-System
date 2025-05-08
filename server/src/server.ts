
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";

let server: Server;

// Handle uncaught exceptions before starting the server
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

async function main() {
  try {
    console.log("⏳ Connecting to the database...");
    await mongoose.connect(config.database_url as string, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });

    console.log("✅ Database connected successfully!");
    server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to the database:", err);
    process.exit(1); // Exit process if DB connection fails
  }
}

main();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  console.error("❌ Unhandled Rejection! Shutting down...");
  console.error(err.name, err.message);

  if (server) {
    server.close(() => {
      console.log("💀 Server closed due to unhandled rejection");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
