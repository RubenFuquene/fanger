const Habitacion = require('./entities/Habitacion');
const servicios = require('./services/Services');
const { inicializarTemperaturas } = require('./services/Inicializador');

/** 
* Configuración de la aplicación
*/
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración para analizar el cuerpo de las solicitudes POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
* Definimos los materiales para las habitaciones
* La conductividad térmica en W/(m·K) 
*/
const materiales = {
  "1.1": { "material": "Ladrillos con aislamiento", "conductividad termica": 1.0 },
  "1.2": { "material": "Fibra de vidrio", "conductividad termica": 0.04 },
  "1.3": { "material": "Paneles sándwich", "conductividad termica": 0.05 }
};

// Creamos las habitaciones
const habitaciones = {
  "1.1": new Habitacion("1.1", materiales["1.1"]),
  "1.2": new Habitacion("1.2", materiales["1.1"]),
  "1.3": new Habitacion("1.3", materiales["1.1"]),
  "1.4": new Habitacion("1.4", materiales["1.1"]),
  "2.1": new Habitacion("2.1", materiales["1.2"]),
  "2.2": new Habitacion("2.2", materiales["1.2"]),
  "2.3": new Habitacion("2.3", materiales["1.2"]),
  "2.4": new Habitacion("2.4", materiales["1.2"]),
  "3.1": new Habitacion("3.1", materiales["1.3"]),
  "3.2": new Habitacion("3.2", materiales["1.3"]),
  "3.3": new Habitacion("3.3", materiales["1.3"]),
  "3.4": new Habitacion("3.4", materiales["1.3"])
};

// Definimos las conexiones
habitaciones["1.1"].agregarConexion(habitaciones["1.2"]);
habitaciones["1.1"].agregarConexion(habitaciones["2.1"]);
habitaciones["1.1"].agregarConexion(habitaciones["1.4"]);

habitaciones["1.2"].agregarConexion(habitaciones["1.1"]);
habitaciones["1.2"].agregarConexion(habitaciones["1.3"]);
habitaciones["1.2"].agregarConexion(habitaciones["2.2"]);

habitaciones["1.3"].agregarConexion(habitaciones["1.2"]);
habitaciones["1.3"].agregarConexion(habitaciones["1.4"]);
habitaciones["1.3"].agregarConexion(habitaciones["2.3"]);

habitaciones["1.4"].agregarConexion(habitaciones["1.1"]);
habitaciones["1.4"].agregarConexion(habitaciones["1.3"]);
habitaciones["1.4"].agregarConexion(habitaciones["2.4"]);

habitaciones["2.1"].agregarConexion(habitaciones["1.1"]);
habitaciones["2.1"].agregarConexion(habitaciones["2.2"]);
habitaciones["2.1"].agregarConexion(habitaciones["2.4"]);
habitaciones["2.1"].agregarConexion(habitaciones["3.1"]);

habitaciones["2.2"].agregarConexion(habitaciones["1.2"]);
habitaciones["2.2"].agregarConexion(habitaciones["2.1"]);
habitaciones["2.2"].agregarConexion(habitaciones["2.3"]);
habitaciones["2.2"].agregarConexion(habitaciones["3.2"]);

habitaciones["2.3"].agregarConexion(habitaciones["1.3"]);
habitaciones["2.3"].agregarConexion(habitaciones["2.2"]);
habitaciones["2.3"].agregarConexion(habitaciones["2.4"]);
habitaciones["2.3"].agregarConexion(habitaciones["3.3"]);

habitaciones["2.4"].agregarConexion(habitaciones["1.4"]);
habitaciones["2.4"].agregarConexion(habitaciones["2.1"]);
habitaciones["2.4"].agregarConexion(habitaciones["2.3"]);
habitaciones["2.4"].agregarConexion(habitaciones["3.4"]);

habitaciones["3.1"].agregarConexion(habitaciones["2.1"]);
habitaciones["3.1"].agregarConexion(habitaciones["3.2"]);
habitaciones["3.1"].agregarConexion(habitaciones["3.4"]);

habitaciones["3.2"].agregarConexion(habitaciones["2.2"]);
habitaciones["3.2"].agregarConexion(habitaciones["3.1"]);
habitaciones["3.2"].agregarConexion(habitaciones["3.3"]);

habitaciones["3.3"].agregarConexion(habitaciones["2.3"]);
habitaciones["3.3"].agregarConexion(habitaciones["3.2"]);
habitaciones["3.3"].agregarConexion(habitaciones["3.4"]);

habitaciones["3.4"].agregarConexion(habitaciones["2.4"]);
habitaciones["3.4"].agregarConexion(habitaciones["3.1"]);
habitaciones["3.4"].agregarConexion(habitaciones["3.3"]);

inicializarTemperaturas(habitaciones);

app.get('/colores', (req, res) => {

  const habitacionesSimplificadas = Object.fromEntries(
    Object.entries(habitaciones).map(([clave, habitacion]) => [
      clave,
      {
        numero: habitacion.numero,
        conexiones: habitacion.conexiones.map(conexion => conexion.numero),
        color: habitacion.color,
        sugerencia: habitacion.sugerencia
      }
    ])
  );

  res.render('index', { habitacionesSimplificadas });
});

app.get('/', (req, res) => {
  res.render('home')
});

// Ruta para manejar la solicitud POST
app.post('/calcular_pmv', (req, res) => {
  // Captura de variables desde el cuerpo de la solicitud
  const ropa = parseFloat(req.body.ropa);
  const tasaMetabolica = parseFloat(req.body.tasaMetabolica);
  const temperatura = parseFloat(req.body.temperatura);
  const humedad = parseFloat(req.body.humedad);
  const velocidadAire = parseFloat(req.body.velocidadAire);

  // Convertir el objeto habitaciones en un array de sus valores
  const habitacionesArray = Object.values(habitaciones);

  //Carga de valores para humedad
  habitacionesArray.forEach(habitacion => {
    habitacion.humedadRelativa = humedad / 100;
  });

  //Carga de valores para velocidad del aire
  habitacionesArray.forEach(habitacion => {
    habitacion.velocidadAire = velocidadAire;
  });

  //Carga de valores para la actividad metabólica
  habitacionesArray.forEach(habitacion => {
    habitacion.actividadMetabolica = tasaMetabolica;
  });

  //Carga de valores para el valor de aislamiento de la ropa
  habitacionesArray.forEach(habitacion => {
    habitacion.resistenciaVesitmenta = ropa;
  });

  //Carga de valores para la temperatura
  habitacionesArray.forEach(habitacion => {
    habitacion.calcularNuevaTemperatura(temperatura);
  });

  /*
  // Imprimir temperaturas iniciales
  console.log('Temperaturas iniciales:');
  habitacionesArray.forEach(habitacion => {
    console.log(`Habitación ${habitacion.numero}: ${habitacion.temperatura.toFixed(2)}°C`);
  });

  // Realizar varias iteraciones para simular la propagación de temperatura
  for (let iteracion = 1; iteracion <= 5; iteracion++) {
    console.log(`\nIteración ${iteracion}:`);

    habitacionesArray.forEach(habitacion => {
      const temperaturaAntes = habitacion.temperatura.toFixed(2);
      habitacion.actualizarTemperatura();
      const temperaturaDespues = habitacion.temperatura.toFixed(2);

      habitacion.calcularPMV();

      console.log(`Habitación ${habitacion.numero}: ${temperaturaAntes}°C -> ${temperaturaDespues}°C`);
    });

    // Imprimir resultados
    habitacionesArray.forEach(habitacion => {
      console.log(`Habitación ${habitacion.numero}: ${habitacion.temperatura.toFixed(2)}°C - Evaluación de confort: ${habitacion.calcularPMV()}`);
    });
  }*/

  // Imprimir resultados
  habitacionesArray.forEach(habitacion => {
    console.log(`Habitación ${habitacion.numero}: ${habitacion.temperatura.toFixed(2)}°C - Evaluación de confort: ${habitacion.calcularPMV()}`);
  });

  habitacionesArray.forEach(habitacion => {
    habitacion.calcularPMV()
  });

  const habitacionesSimplificadas = Object.fromEntries(
    Object.entries(habitaciones).map(([clave, habitacion]) => [
      clave,
      {
        numero: habitacion.numero,
        conexiones: habitacion.conexiones.map(conexion => conexion.numero),
        color: servicios.asignarColorSegunPMV(habitacion.pmv),
        mensaje: habitacion.mensaje,
        temperatura: Math.trunc(habitacion.temperatura),
        sugerencia: habitacion.sugerencia
      }
    ])
  );

  res.render('index', { habitacionesSimplificadas });

});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
})