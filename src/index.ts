// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db";
// import userRoutes from "./routes/user.routes";
// import songRoutes from "./routes/songs.routes";
// import { setupSwagger } from "./docs/swagger";

// dotenv.config();
// const app = express();
// app.use(express.static("public"));

// app.use(cors());
// app.use(express.json());

// connectDB();
// setupSwagger(app);
// app.use("/api", userRoutes);
// app.use("/api",songRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/user.routes";
import songRoutes from "./routes/songs.routes";
import { setupSwagger } from "./docs/swagger";

dotenv.config();

const app = express();
app.use(express.static("public"));

app.use(cors());
app.use(express.json());

connectDB();
setupSwagger(app);
app.use("/api", userRoutes);
app.use("/api", songRoutes);


// Ruta simple de prueba
app.get("/ping", (_req, res) => {
    res.send("pong");
  });

// ❌ Ya no se usa app.listen aquí
// ✅ Exportamos la app para usarla en api.ts
export default app;