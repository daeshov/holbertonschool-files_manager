const Redis = require('redis'); // Correr "npm list redis" para asegurarme de tener instalada la biblioteca Redis
const { promisify } = require('util');
//import * as redis from 'redis';


class RedisClient {
  constructor() {
    this.client = Redis.createClient();

    this.getAsync = promisify(this.client.get).bind(this.client);
    // Manejar errores de conexión
    this.client.on('error', (err) => {
      console.error(`Error en la conexión Redis: ${err}`);
    });
  }

  async isAlive() {
    // Verificar si la conexión está viva
    return new Promise((resolve) => {
      this.client.ping('pong', (err) => {
        resolve(err);
      });
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
