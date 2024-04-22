function imprimirGrafo(edificio) {
  for (const habitacion in edificio) {
    console.log(`Habitación ${habitacion} - Material: ${edificio[habitacion].material.material}, Conductividad Térmica: ${edificio[habitacion].material["conductividad termica"]}`);
    const conexiones = edificio[habitacion].conexiones.map(h => h.numero).join(", ");
    console.log(`   Conexiones: ${conexiones}`);
  }
}

// Función para colorear el grafo
function colorearGrafo(habitaciones) {
  let colores = new Map();

  // Función para obtener el color disponible más bajo para una habitación
  function obtenerColorDisponible(habitacion) {
    let coloresConexiones = new Set();

    habitacion.conexiones.forEach((conexion) => {
      if (colores.has(conexion.numero)) {
        coloresConexiones.add(colores.get(conexion.numero));
      }
    });

    for (let i = 1; ; i++) {
      if (!coloresConexiones.has(i)) {
        return i;
      }
    }
  }

  // Asignar colores a cada habitación
  Object.values(habitaciones).forEach((habitacion) => {
    let color = obtenerColorDisponible(habitacion);
    habitacion.color = color; // Añadir el color a la habitación
    colores.set(habitacion.numero, color);
  });

  return colores;
}

function asignarColorSegunPMV(pmv) {
  // Definir los umbrales de confort según la escala Fanger
  const umbralesConfort = {
    muchoCalor: 3.7,
    bastanteCalor: 3.6,
    algoCalor: 3.5,
    neutro: 3.4,
    algoFrio: 3.3,
    bastanteFrio: 3.2,
    muchoFrio: 3.1
  };

  // Asignar códigos de color según los umbrales de confort
  if (pmv >= umbralesConfort.muchoCalor) {
    return "#FF0000"; // Rojo
  } else if (pmv >= umbralesConfort.bastanteCalor) {
    return "#FFA500"; // Naranja
  } else if (pmv >= umbralesConfort.algoCalor) {
    return "#FFFF00"; // Amarillo
  } else if (pmv >= umbralesConfort.neutro) {
    return "#008000"; // Verde
  } else if (pmv >= umbralesConfort.algoFrio) {
    return "#0000FF"; // Azul
  } else if (pmv >= umbralesConfort.bastanteFrio) {
    return "#800080"; // Violeta
  } else {
    return "#800080"; // Morado (para valores extremadamente fríos)
  }
}

module.exports = {
  imprimirGrafo: imprimirGrafo,
  colorearGrafo: colorearGrafo,
  asignarColorSegunPMV
};