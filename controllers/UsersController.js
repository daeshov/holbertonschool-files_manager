const sha1 = require('sha1');
const user = require('../routes/index'); 

const UsersController = {
  postNew: async (req, res) => {
    try {
      // Extract email and password from the request body
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Check if the email already exists in the database
      const existingUser = await user.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = sha1(password);

      // Create a new user
      const newUser = new user({
        email,
        password: hashedPassword,
      });

      // Save the new user to the database
      await newUser.save();

      // Return the new user with only the email and id
      res.status(201).json({
        email: newUser.email,
        id: newUser._id, // Assuming MongoDB generates the ID automatically
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = UsersController;
