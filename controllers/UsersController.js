import crypto from 'crypto';
import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import RedisClient from '../utils/redis';
import dbClient from '../utils/db';

export const postNew = async (req, res) => {
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

  return res.status(201).json({ email: user.email, id: user._id });
};