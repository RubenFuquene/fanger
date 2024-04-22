// Función para inicializar temperaturas aleatorias
function inicializarTemperaturas(habitaciones) {
  // Convertir el objeto habitaciones en un array de sus valores
  const habitacionesArray = Object.values(habitaciones);

  habitacionesArray.forEach(habitacion => {
    habitacion.temperatura = Math.random() * 30 + 10; // Temperaturas aleatorias entre 10 y 40 grados
  });
}

module.exports = {
  inicializarTemperaturas
};