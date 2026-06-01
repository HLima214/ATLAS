// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve os arquivos estáticos do build do React
app.use(express.static(path.join(__dirname, 'dist')));

// Redireciona todas as rotas para o index.html (SPA)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ATLAS rodando na porta ${PORT}`);
});