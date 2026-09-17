import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "ChannelForge AI Server is running" });
  });

  // Example API route stub for AI generation later
  app.post("/api/generate-channel", async (req, res) => {
    try {
      const { idea } = req.body;
      if (!idea) {
         res.status(400).json({ error: "Channel idea is required" });
         return;
      }
      
      // AI Logic will go here.
      // For now, this is a scaffolded endpoint.
      res.json({ 
        success: true, 
        message: "Channel generation started",
        data: { idea } 
      });
    } catch (error) {
      console.error("Error generating channel:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve index.html for all other routes to support SPA routing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
