const mongoose = require('mongoose');

const listaSchema = new mongoose.Schema({
  pareja: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pareja',
    required: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  emoji: {
    type: String,
    default: '🛒'
  },
  activa: {
    type: Boolean,
    default: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  },
  actualizadoEn: {
    type: Date,
    default: Date.now
  }
});

listaSchema.pre('save', function (next) {
  this.actualizadoEn = new Date();
  next();
});

module.exports = mongoose.model('Lista', listaSchema);
