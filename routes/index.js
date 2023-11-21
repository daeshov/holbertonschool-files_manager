const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
const AuthController = require('../controllers/AuthController');
const FilesController = require ('../controllers/FilesController');
const UsersController = require ('../controllers/UsersController');

function controllerRouting(app) {
  const router = express.Router();
  app.use('/', router);

  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });

  router.post('/files', (req, res) => {
    FilesController.postUpload(req, res);
  });

  router.get('/files/:id', (req, res) => {
    FilesController.getShow(req, res);
  });

  router.get('/files', (req, res) => {
    FilesController.getIndex(req, res);
  });

  router.put('/files/:id/publish', FilesController.putPublish);
  router.put('/files/:id/unpublish', FilesController.putUnpublish);

  router.get('/files/:id/data', (req, res) => {
    FilesController.getFile(req, res);

  

  });
}

module.exports = controllerRouting;
module.exports = router;
