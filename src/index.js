require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const connectDB = require('../config/database');
const setupSockets = require('./sockets');

const parejaRoutes = require('./routes/parejas');
const listaRoutes = require('./routes/listas');
const elementoRoutes = require('./routes/elementos');

const app = express();
const server = http.createServer(app);

// ── Socket.io ──────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

setupSockets(io);

// ── Middlewares ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// ── Rutas API ──────────────────────────────────────────────────
app.use('/api/parejas', parejaRoutes);
app.use('/api/listas', listaRoutes);
app.use('/api/elementos', elementoRoutes);

// ── Healthcheck ────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    mensaje: '🛒 Compras backend funcionando',
    ts: new Date(),
  });
});

// ── Ruta de categorías (referencia para el frontend) ───────────
app.get('/api/categorias', (req, res) => {
  const categorias = [
    { id: 'frutas', nombre: 'Frutas', emoji: '🍎' },
    { id: 'verduras', nombre: 'Verduras', emoji: '🥦' },
    { id: 'carnes_pescados', nombre: 'Carnes y Pescados', emoji: '🥩' },
    { id: 'lacteos_huevos', nombre: 'Lácteos y Huevos', emoji: '🥛' },
    { id: 'panaderia', nombre: 'Panadería', emoji: '🍞' },
    { id: 'galletas_dulces', nombre: 'Galletas y Dulces', emoji: '🍪' },
    { id: 'chocolate', nombre: 'Chocolate', emoji: '🍫' },
    { id: 'cafe_infusiones', nombre: 'Café e Infusiones', emoji: '☕' },
    { id: 'bebidas', nombre: 'Bebidas', emoji: '🧃' },
    { id: 'arroz_pasta', nombre: 'Arroz y Pasta', emoji: '🍚' },
    { id: 'legumbres', nombre: 'Legumbres', emoji: '🫘' },
    { id: 'frutos_secos', nombre: 'Frutos Secos', emoji: '🥜' },
    { id: 'conservas_salsas', nombre: 'Conservas y Salsas', emoji: '🥫' },
    {
      id: 'especias_condimentos',
      nombre: 'Especias y Condimentos',
      emoji: '🫙',
    },
    { id: 'cremas_cuidado', nombre: 'Cremas y Cuidado Personal', emoji: '🧴' },
    { id: 'limpieza', nombre: 'Limpieza', emoji: '🧹' },
    { id: 'congelados', nombre: 'Congelados', emoji: '🧊' },
    { id: 'trastero', nombre: 'Trastero / Almacén', emoji: '🏠' },
    { id: 'otros', nombre: 'Otros', emoji: '🛍️' },
  ];
  res.json({ ok: true, categorias });
});

// ── 404 ────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
});

// ── Error handler ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥 Error:', err);
  res.status(500).json({ ok: false, error: 'Error interno del servidor' });
});

// ── Arranque ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 WebSockets listos`);
  });
});
