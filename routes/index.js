//Importacion 
import { postNew, getMe } from '../controllers/UsersController';

// Configurando las rutas index.js

const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
const UserController = require('../controllers/UsersController');

//Ruta para obtener el estado
router.get('/status', AppController.getStatus);

//Ruta para obtener estadisticas
router.get('/stats', AppController.getStats);

// Route to creeate new user
router.post('/users', UserController, postNew);

module.exports = router;
