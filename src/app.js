const mongoose=require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
require("dotenv").config();
var app = express();
var port = process.env.PORT || 3525;
//Conexion a la base de datos
mongoose.connect(process.env.CONECTIONSTRING , {})
      .then(() => {
        console.log('Connected to MongoDB')
      })
      .catch((err) => {
        console.log('Error connecting to MongoDB', err.message)
      })

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//llamada a las rutas
app.use('/', require('./Routes/habit.routes'));

app.listen(port, function(){
	console.log(`Server running in http://localhost:${port}`);
	console.log('Defined routes:');
	console.log('	[GET] http://localhost:3525/');
});