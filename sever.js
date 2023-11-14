const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

//Carga las rutas desde routes/index.js
const routes = require('./routes');
app.use('/', routes); 

//Inicializando el servidor
app.listen(PORT,() => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
