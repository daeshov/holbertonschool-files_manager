// Configurando las rutas index.js

const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');

//Ruta para obtener el estado
router.get('/status', AppController.getStatus);

//Ruta para obtener estadisticas
router.get('/stats', AppController.getStats);

module.exports = router;
