const mongoose = require('mongoose');

// Categorías predefinidas con sus emojis
const CATEGORIAS = [
  'frutas',
  'verduras',
  'carnes_pescados',
  'lacteos_huevos',
  'panaderia',
  'galletas_dulces',
  'chocolate',
  'cafe_infusiones',
  'bebidas',
  'arroz_pasta',
  'legumbres',
  'frutos_secos',
  'conservas_salsas',
  'especias_condimentos',
  'cremas_cuidado',
  'limpieza',
  'congelados',
  'trastero',
  'otros',
];

const elementoSchema = new mongoose.Schema({
  lista: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lista',
    required: true,
  },
  pareja: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pareja',
    required: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  emoji: {
    type: String,
    default: '🛍️',
  },
  categoria: {
    type: String,
    enum: CATEGORIAS,
    default: 'otros',
  },
  cantidad: {
    type: Number,
    default: 1,
    min: 0.1,
  },
  unidad: {
    type: String,
    default: 'ud',
    trim: true,
    // Ejemplos: "ud", "kg", "g", "L", "ml", "bolsa", "paquete"...
  },
  necesario: {
    // true = hay que comprarlo, false = ya lo tenemos / no hace falta
    type: Boolean,
    default: true,
  },
  notas: {
    type: String,
    trim: true,
    default: '',
  },
  orden: {
    // Para ordenar dentro de la categoría
    type: Number,
    default: 0,
  },
  creadoPor: {
    // Nombre/alias de quien lo añadió
    type: String,
    default: '',
  },
  creadoEn: {
    type: Date,
    default: Date.now,
  },
  actualizadoEn: {
    type: Date,
    default: Date.now,
  },
});

elementoSchema.pre('save', function (next) {
  this.actualizadoEn = new Date();
  next();
});

// Índices para filtros rápidos
elementoSchema.index({ lista: 1, categoria: 1 });
elementoSchema.index({ lista: 1, necesario: 1 });
elementoSchema.index({ pareja: 1 });

module.exports = mongoose.model('Elemento', elementoSchema);
module.exports.CATEGORIAS = CATEGORIAS;
