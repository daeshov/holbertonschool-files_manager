const express = require('express');
const controllerRouting = require('./routes/index');
require('dotenv').config()
console.log(process.env.PORT);
const exPort = process.env.PORT || 5001;
const app = express();

app.use(express.json());

controllerRouting(app);

app.listen(exPort, () => {
  console.log(`Server running on port ${exPort}`);
});
