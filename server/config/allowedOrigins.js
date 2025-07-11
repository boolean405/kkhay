const baseOrigins = [
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://192.168.1.10:8081",
];

// Parse additional origins from .env
const extraOrigins = process.env.EXTRA_ALLOWED_ORIGINS
  ? process.env.EXTRA_ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

// Merge and remove duplicates
const allowedOrigins = [...new Set([...baseOrigins, ...extraOrigins])];

export default allowedOrigins;
