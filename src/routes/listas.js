const express = require('express');
const router = express.Router();
const { obtenerListas, crearLista, editarLista, eliminarLista } = require('../controllers/listaController');

router.get('/:codigoPareja', obtenerListas);
router.post('/:codigoPareja', crearLista);
router.put('/:listaId', editarLista);
router.delete('/:listaId', eliminarLista);

module.exports = router;
