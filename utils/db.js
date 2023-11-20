const MongoClient = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';
const db_uri = "mongodb+srv://jdarahthomas:Z63ct2EYFgvLNyAg@cluster0.g80qlgd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(db_uri, {useNewUrlParser: true, useUnifiedTopology: true });

class DBClient {
  constructor() {
    this.db = null;
    client.connect((err) => {
      if (err) {
        console.log(err);
      } else {
        this.db = client.db('files_manager');
        this.db.createCollection('users');
        this.db.createCollection('files');
      }
    });
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
