import { ObjectId } from 'mongodb';
import RedisClient from '../utils/redis';
import dbClient from '../utils/db';

class UsersController {
  
  static async postNew(req, res) {
    const { email, password } = req.body; 

   // Check for missing email or password
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });
  
  //  if (!email) {
  //
  //  return res.status(400).json({ error: 'Missing email' });
  //
  //   
  //
  //   if (!password) {
  //
  //  return res.status(400).json({ error: 'Missing password' });
  //
  //  }

    //  Mira si el email aun existe en la base de datos
    const existingUser = await dbClient.findUser({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const user = await dbClient.db.collection('users').insertOne({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ id: user.insertedId, email });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    const userId = await RedisClient.get(key);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });

    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    return res.status(200).send({ id: user._id, email: user.email });
  }
}

export default UsersController;
