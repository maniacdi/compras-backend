const express = require('express');
const router = express.Router();
const { crearPareja, obtenerPareja, actualizarPareja } = require('../controllers/parejaController');

router.post('/', crearPareja);
router.get('/:codigo', obtenerPareja);
router.put('/:codigo', actualizarPareja);

module.exports = router;
