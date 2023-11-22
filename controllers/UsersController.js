import crypto from 'crypto';
import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import RedisClient from '../utils/redis';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(request, response) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  // Check if the email already exists in the database
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
  static async getMe(request, response) {
    const token = request.headers['x-token'];
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return response.status(401).send({ error: 'Unauthorized' });
    }

    const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });

    if (!user) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    return response.status(200).send({ id: user._id, email: user.email });

}
}

export default UsersController;