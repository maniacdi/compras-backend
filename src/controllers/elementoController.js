const Elemento = require('../models/Elemento');
const Lista = require('../models/Lista');
const Pareja = require('../models/Pareja');

// GET /api/elementos/:listaId - Obtener elementos con filtros
// Query params: categoria, necesario, buscar, ordenPor
const obtenerElementos = async (req, res) => {
  try {
    const { listaId } = req.params;
    const { categoria, necesario, buscar, ordenPor } = req.query;

    const filtro = { lista: listaId };

    if (categoria && categoria !== 'todas') {
      filtro.categoria = categoria;
    }

    if (necesario !== undefined && necesario !== '') {
      filtro.necesario = necesario === 'true';
    }

    if (buscar) {
      filtro.nombre = { $regex: buscar, $options: 'i' };
    }

    let ordenQuery = { categoria: 1, orden: 1, nombre: 1 }; // Por defecto: por categoría
    if (ordenPor === 'nombre') ordenQuery = { nombre: 1 };
    if (ordenPor === 'reciente') ordenQuery = { creadoEn: -1 };
    if (ordenPor === 'cantidad') ordenQuery = { cantidad: -1 };

    const elementos = await Elemento.find(filtro).sort(ordenQuery);
    res.json({ ok: true, elementos });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// POST /api/elementos/:listaId - Añadir elemento
const crearElemento = async (req, res) => {
  try {
    const lista = await Lista.findById(req.params.listaId);
    if (!lista)
      return res.status(404).json({ ok: false, error: 'Lista no encontrada' });

    const { nombre, emoji, categoria, cantidad, unidad, notas, creadoPor } =
      req.body;

    // Verificar si ya existe un elemento con ese nombre en la lista
    const yaExiste = await Elemento.findOne({
      lista: lista._id,
      nombre: { $regex: `^${nombre}$`, $options: 'i' },
    });

    if (yaExiste) {
      return res.status(409).json({
        ok: false,
        error: 'Ya existe un elemento con ese nombre en la lista',
        elemento: yaExiste,
      });
    }

    const elemento = await Elemento.create({
      lista: lista._id,
      pareja: lista.pareja,
      nombre,
      emoji: emoji || '🛍️',
      categoria: categoria || 'otros',
      cantidad: cantidad || 1,
      unidad: unidad || 'ud',
      notas: notas || '',
      creadoPor: creadoPor || '',
      necesario: true,
    });

    res.status(201).json({ ok: true, elemento });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// PUT /api/elementos/:elementoId - Editar elemento
const editarElemento = async (req, res) => {
  try {
    const updates = req.body;
    updates.actualizadoEn = new Date();

    const elemento = await Elemento.findByIdAndUpdate(
      req.params.elementoId,
      updates,
      { new: true, runValidators: true },
    );

    if (!elemento)
      return res
        .status(404)
        .json({ ok: false, error: 'Elemento no encontrado' });

    res.json({ ok: true, elemento });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// PATCH /api/elementos/:elementoId/toggle - Marcar/desmarcar necesario
const toggleNecesario = async (req, res) => {
  try {
    const elemento = await Elemento.findById(req.params.elementoId);
    if (!elemento)
      return res
        .status(404)
        .json({ ok: false, error: 'Elemento no encontrado' });

    elemento.necesario = !elemento.necesario;
    elemento.actualizadoEn = new Date();
    await elemento.save();

    res.json({ ok: true, elemento });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// DELETE /api/elementos/:elementoId - Eliminar elemento
const eliminarElemento = async (req, res) => {
  try {
    const elemento = await Elemento.findByIdAndDelete(req.params.elementoId);
    if (!elemento)
      return res
        .status(404)
        .json({ ok: false, error: 'Elemento no encontrado' });

    res.json({ ok: true, mensaje: 'Elemento eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// PATCH /api/elementos/:listaId/desmarcar-todos - Poner todos a necesario: false
const desmarcarTodos = async (req, res) => {
  try {
    const result = await Elemento.updateMany(
      { lista: req.params.listaId },
      { necesario: false, actualizadoEn: new Date() },
    );

    res.json({ ok: true, actualizados: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// PATCH /api/elementos/:listaId/marcar-todos - Poner todos a necesario: true
const marcarTodos = async (req, res) => {
  try {
    const result = await Elemento.updateMany(
      { lista: req.params.listaId },
      { necesario: true, actualizadoEn: new Date() },
    );

    res.json({ ok: true, actualizados: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// PATCH /api/elementos/:listaId/reordenar
// Body: { elementos: [ { _id, orden }, { _id, orden }, ... ] }
// Se llama tras un drag & drop con el nuevo orden de todos los elementos afectados
const reordenarElementos = async (req, res) => {
  try {
    const { elementos } = req.body;

    if (!Array.isArray(elementos) || elementos.length === 0) {
      return res
        .status(400)
        .json({
          ok: false,
          error: 'Se esperaba un array de elementos con _id y orden',
        });
    }

    const operaciones = elementos.map(({ _id, orden }) => ({
      updateOne: {
        filter: { _id },
        update: { orden, actualizadoEn: new Date() },
      },
    }));

    await Elemento.bulkWrite(operaciones);

    res.json({ ok: true, actualizados: operaciones.length });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  obtenerElementos,
  crearElemento,
  editarElemento,
  toggleNecesario,
  eliminarElemento,
  desmarcarTodos,
  marcarTodos,
  reordenarElementos,
};
