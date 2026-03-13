import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import followRoutes from "./routes/follow.routes.js";
import workRoutes from "./routes/work.routes.js";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cron from "node-cron";
import { prisma } from "./lib/prisma.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Limpieza de tokens expirados cada 24 horas
cron.schedule("0 0 * * *", async () => {
  console.log("🧹 Limpiando refresh tokens expirados...");

  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    console.log(`✅ Tokens eliminados: ${result.count}`);
  } catch (error) {
    console.error("❌ Error limpiando tokens:", error);
  }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API läuf 🚀" });
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/works", workRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🟢 Die API läuft auf Port: ${PORT}`);
});
