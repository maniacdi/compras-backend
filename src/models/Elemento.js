const mongoose = require('mongoose');

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
  'hogar',
  'bicarbonato',
  'cocina',
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
  },
  necesario: {
    type: Boolean,
    default: true,
  },
  notas: {
    type: String,
    trim: true,
    default: '',
  },
  orden: {
    type: Number,
    default: 0,
  },
  creadoPor: {
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

elementoSchema.index({ lista: 1, categoria: 1 });
elementoSchema.index({ lista: 1, necesario: 1 });
elementoSchema.index({ pareja: 1 });

module.exports = mongoose.model('Elemento', elementoSchema);
module.exports.CATEGORIAS = CATEGORIAS;
