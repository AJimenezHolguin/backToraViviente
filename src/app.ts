<<<<<<< HEAD
import http from 'http';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hola, mundo con TypeScript!\n');
});

const PORT = 8080;
server.listen(PORT, () => {
console.log(`Servidor corriendo en http://localhost:${PORT}/`);
});
=======
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/user.routes";
import songRoutes from "./routes/songs.routes";
import { setupSwagger } from "./docs/swagger";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();
setupSwagger(app);
app.use("/api", userRoutes);
app.use("/api",songRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
>>>>>>> 9726a4c12b76eb8d283a1fc93101182ee6b15d5c
