const Pareja = require('../models/Pareja');
const Lista = require('../models/Lista');
const { nanoid } = require('nanoid');

// Generar código único de 6 caracteres en mayúsculas
const generarCodigo = () => nanoid(6).toUpperCase();

// POST /api/parejas - Crear nueva pareja (primer usuario)
const crearPareja = async (req, res) => {
  try {
    const { nombre } = req.body;

    let codigo;
    let existe = true;

    // Asegurar que el código es único
    while (existe) {
      codigo = generarCodigo();
      existe = await Pareja.findOne({ codigo });
    }

    const pareja = await Pareja.create({ codigo, nombre: nombre || 'Mi Lista' });

    // Crear lista por defecto
    await Lista.create({
      pareja: pareja._id,
      nombre: 'Lista Principal',
      emoji: '🛒'
    });

    res.status(201).json({ ok: true, pareja });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// GET /api/parejas/:codigo - Unirse/obtener pareja por código
const obtenerPareja = async (req, res) => {
  try {
    const { codigo } = req.params;
    const pareja = await Pareja.findOne({ codigo: codigo.toUpperCase() });

    if (!pareja) {
      return res.status(404).json({ ok: false, error: 'Código no encontrado. Comprueba que está bien escrito.' });
    }

    res.json({ ok: true, pareja });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// PUT /api/parejas/:codigo - Actualizar nombre de la pareja
const actualizarPareja = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nombre } = req.body;

    const pareja = await Pareja.findOneAndUpdate(
      { codigo: codigo.toUpperCase() },
      { nombre },
      { new: true }
    );

    if (!pareja) return res.status(404).json({ ok: false, error: 'Pareja no encontrada' });

    res.json({ ok: true, pareja });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = { crearPareja, obtenerPareja, actualizarPareja };
