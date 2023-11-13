// importa el paquete mongodb y configura las variables de entorno.
const { MongoClient } = require('mongodb');

const {
  DB_HOST = 'localhost',
  DB_PORT = 27017,
  DB_DATABASE = 'files_manager',
} = process.env;

// Creacion de DBCliente con sus variables de entorno

class DBClient {
  constructor() {
    this.db = null;
    MongoClient.connect(
      `mongodb://${host}:${port}/${dbName}`,
      { useUnifiedTopology: true },
      (err, client) => {
        if (err) console.log(err);
        this.db = client.db(dbName);
        this.db.createCollection('users');
        this.db.createCollection('files');
      },
    );
  }

  isAlive() {
    return !!this.db;
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
