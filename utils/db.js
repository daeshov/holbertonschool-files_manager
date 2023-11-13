//importa el paquete mongodb y configura las variables de entorno.
const { MongoClient } = require('mongodb');

const {
  DB_HOST = 'localhost',
  DB_PORT = 27017,
  DB_DATABASE = 'files_manager',
} = process.env;

//Creacion de DBCliente con sus variables de entorno

class DBClient {
  constructor() {
    this.client = new MongoClient(`mongodb://${DB_HOST}:${DB_PORT}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.db = null; // Se asignará más adelante cuando se establezca la conexión
  }

  async isAlive() {
    try {
      await this.client.connect();
      const database = this.client.db(this.databaseName);
      await database.command({ ping: 1 });
      return true;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      return false;
    } finally {
      await this.client.close();
    }
  }


  async nbUsers() {
    try {
      const usersCollection = this.db.collection('users');
      const userCount = await usersCollection.countDocuments();
      return userCount;
    } catch (error) {
      console.error('Error getting user count:', error.message);
      return -1; // O cualquier valor que indique un error
    }
  }

  async nbFiles() {
    try {
      const filesCollection = this.db.collection('files');
      const fileCount = await filesCollection.countDocuments();
      return fileCount;
    } catch (error) {
      console.error('Error getting file count:', error.message);
      return -1; // O cualquier valor que indique un error
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;

