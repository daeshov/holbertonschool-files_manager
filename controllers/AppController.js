// aqui abajo estamos usando las funciones de utilidad
const {
  getRedisStatus, getDBStatus, countUsers, countFiles,
} = require('../utils/redis');

const AppController = {
  getStatus: async (req, res) => {
    try {
      // Obtener el estado de Redis y la DB
      const redisStatus = await getRedisStatus();
      const dbStatus = await getDBStatus();

      // Responder con el estado y codigo de estado 200
      res.status(200).json({ redis: redisStatus, db: dbStatus });
    } catch (error) {
      // Manejar errores y responder con un codigo de estado 500 en caso de error
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getStats: async (req, res) => {
    try {
      // Contar usuarios y archivos utilizando las funciones de utilidad
      const userCount = await countUsers();
      const filesCount = await countFiles();

      // Responder con el recuento de usuarios y archivos y código de estado 200
      res.status(200).json({ redis: userCount, files: filesCount });
    } catch (error) {
      // Manejar errores y responder con un codigo de estado 500 en caso de error
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = AppController;
