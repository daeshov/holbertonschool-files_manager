const Redis = require('redis'); // Correr "npm list redis" para asegurarme de tener instalada la biblioteca Redis
const { promisify } = require('util');
//import * as redis from 'redis';


class RedisClient {
  constructor() {
    this.client = Redis.createClient();

    this.getAsync = promisify(this.client.get).bind(this.client);
    // Manejar errores de conexión
    this.client.on('error', (error) => {
      console.error(`Error en la conexión Redis: ${error.message}`);
    });
  }

  async isAlive() {
    return this.client.connected;
  }
    // Verificar si la conexión está viva
//    return new Promise((resolve) => {
//      this.client.ping('pong', (err) => {
//        resolve(err);
//      });
//    });
//  }

  async get(key) {
    return this.getAsync(key);
  }

  async set(key, value, duration) {
    this.client.setAsync(key, duration, 'EX', value);
  }

  async del(key) {
    this.client.delAsync(key);
  }
}

// Crear e exportar una instancia de RedisClient llamada redisClient
const redisClient = new RedisClient();
module.exports = redisClient;
