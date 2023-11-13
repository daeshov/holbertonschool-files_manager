// Importancion del Modulo, que proporciona la->
// ->funcionalidad necesaria para interactuar con la base de datos
const MongoClient = require('mongodb');

// Declaracion de las variables de configuracion
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';

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

  async nbUsers() { return this.db.collection('users').countDocuments(); }

  async nbFiles() { return this.db.collection('files').countDocuments(); }

  async findUser(user) { return this.db.collection('users').findOne(user); }

  async createUser(email, password) {
    await this.db.collection('users').insertOne({ email, password });

    const newUser = await this.db.collection('users').findOne({ email });

    return { id: newUser._id, email };
  }

  async uploadFile(data) {
    await this.db.collection('files').insertOne(data);
    return this.db.collection('files').findOne(data);
  }

  async findFile(data) {
    return this.db.collection('files').findOne(data);
  }

  async aggregateFiles(userId, parentId, page = 1) {
    const user = { userId };
    if (parentId && parentId !== undefined) user.parentId = parentId;

    const cursor = await this.db.collection('files').aggregate([
      { $match: user },
      { $skip: (page - 1) * 20 },
      { $limit: 20 },
    ]).toArray();
    const files = [];
    cursor.forEach(({
      _id, userId, name, type, isPublic, parentId,
    }) => {
      files.push({
        id: _id, userId, name, type, isPublic, parentId,
      });
    });
    return files;
  }

  async updateFile(data, change) {
    await this.db.collection('files').updateOne(data, { $set: change });
    return this.db.collection('files').findOne(data);
  }
}

const dbClient = new DBClient();

module.exports = dbClient;

// DBClient should have:
// the constructor that creates a client to MongoDB:
// host: from the environment variable DB_HOST or default: localhost
// port: from the environment variable DB_PORT or default: 27017
// database: from the environment variable DB_DATABASE or default: files_manager
// a function isAlive that returns true when the connection to MongoDB is a success otherwise, false
// an asynchronous function nbUsers that returns the number of documents in the collection users
// an asynchronous function nbFiles that returns the number of documents in the collection files
// After the class definition, create and export an instance of DBClient called dbClient.
