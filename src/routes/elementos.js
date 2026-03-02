const express = require('express');
const router = express.Router();
const {
  obtenerElementos,
  crearElemento,
  editarElemento,
  toggleNecesario,
  eliminarElemento,
  desmarcarTodos,
  marcarTodos,
  reordenarElementos,
} = require('../controllers/elementoController');

router.get('/:listaId', obtenerElementos);
router.post('/:listaId', crearElemento);
router.patch('/:listaId/desmarcar-todos', desmarcarTodos);
router.patch('/:listaId/marcar-todos', marcarTodos);
router.patch('/:listaId/reordenar', reordenarElementos);
router.patch('/:elementoId/toggle', toggleNecesario);
router.put('/:elementoId', editarElemento);
router.delete('/:elementoId', eliminarElemento);

module.exports = router;
