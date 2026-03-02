const Lista = require('../models/Lista');
const Elemento = require('../models/Elemento');
const Pareja = require('../models/Pareja');

// GET /api/listas/:codigoPareja - Obtener todas las listas de una pareja
const obtenerListas = async (req, res) => {
  try {
    const pareja = await Pareja.findOne({ codigo: req.params.codigoPareja.toUpperCase() });
    if (!pareja) return res.status(404).json({ ok: false, error: 'Pareja no encontrada' });

    const listas = await Lista.find({ pareja: pareja._id }).sort({ creadoEn: 1 });
    res.json({ ok: true, listas });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// POST /api/listas/:codigoPareja - Crear nueva lista
const crearLista = async (req, res) => {
  try {
    const pareja = await Pareja.findOne({ codigo: req.params.codigoPareja.toUpperCase() });
    if (!pareja) return res.status(404).json({ ok: false, error: 'Pareja no encontrada' });

    const { nombre, emoji } = req.body;
    const lista = await Lista.create({
      pareja: pareja._id,
      nombre,
      emoji: emoji || '🛒'
    });

    res.status(201).json({ ok: true, lista });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// PUT /api/listas/:listaId - Editar lista
const editarLista = async (req, res) => {
  try {
    const { nombre, emoji, activa } = req.body;
    const lista = await Lista.findByIdAndUpdate(
      req.params.listaId,
      { nombre, emoji, activa, actualizadoEn: new Date() },
      { new: true }
    );
    if (!lista) return res.status(404).json({ ok: false, error: 'Lista no encontrada' });
    res.json({ ok: true, lista });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// DELETE /api/listas/:listaId - Eliminar lista y sus elementos
const eliminarLista = async (req, res) => {
  try {
    const lista = await Lista.findByIdAndDelete(req.params.listaId);
    if (!lista) return res.status(404).json({ ok: false, error: 'Lista no encontrada' });

    // Borrar todos los elementos de la lista
    await Elemento.deleteMany({ lista: req.params.listaId });

    res.json({ ok: true, mensaje: 'Lista eliminada' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = { obtenerListas, crearLista, editarLista, eliminarLista };
