const Redis = require('redis'); // Correr "npm list redis" para asegurarme de tener instalada la biblioteca Redis

class RedisClient {
  constructor() {
    this.client = Redis.createClient();

    // Manejar errores de conexión
    this.client.on('error', (err) => {
      console.error(`Error en la conexión Redis: ${err}`);
    });
  }

  async isAlive() {
    // Verificar si la conexión está viva
    return new Promise((resolve) => {
      if (this.client.connected) {
        this.client.ping('pong', (err) => {
          resolve(err);
        });
      } else {
        resolve(false);
      }
    });
  }

  async get(key) {
    return new Promise((resolve) => {
      this.client.get(key, (err, value) => {
        resolve(value);
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve) => {
      this.client.setex(key, duration, value, (err) => {
        resolve(!err);
      });
    });
  }

  async del(key) {
    return new Promise((resolve) => {
      this.client.del(key, (err) => {
        resolve(!err);
      });
    });
  }
}

// Crear e exportar una instancia de RedisClient llamada redisClient
const redisClient = new RedisClient();
module.exports = redisClient;
