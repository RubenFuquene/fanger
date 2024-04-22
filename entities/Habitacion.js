class Habitacion {
  constructor(numero, material) {
    this.numero = numero;
    this.conexiones = [];
    this.material = material;
    this.temperatura = 0; // Inicializar temperatura en 0
    this.humedadRelativa = 0;
    this.velocidadAire = 0;
    this.actividadMetabolica = 1;
    this.resistenciaVesitmenta = 0;
    this.pmv = 0;
    this.mensaje = '';
    this.sugerencia = '';
  }

  agregarConexion(otraHabitacion) {
    this.conexiones.push(otraHabitacion);
  }

  calcularNuevaTemperatura(temperaturaInicialGeneral) {
    const factorConduccion = 0.5;
    const conductividadMaterial = this.material["conductividad termica"];
    const areaSuperficie = 2; // Área de la superficie de la habitación (m²)
    const distanciaEntreHabitaciones = 1.0; // Distancia entre habitaciones (m)

    // Calcula la cantidad de calor transferido
    const cantidadCalor = factorConduccion * conductividadMaterial * areaSuperficie * (temperaturaInicialGeneral - this.temperatura) / distanciaEntreHabitaciones;

    // Actualiza la temperatura de la habitación
    this.temperatura += cantidadCalor;
  }

  actualizarTemperatura() {
    if (this.conexiones.length === 0)
      return; // No hay conexiones, no hay propagación de temperatura

    const temperaturaPromedio = this.conexiones.reduce((sum, habitacion) => sum + habitacion.temperatura, 0) / this.conexiones.length;

    // Aplicar alguna fórmula para la propagación de temperatura
    this.temperatura = 0.5 * (this.temperatura + temperaturaPromedio);
  }

  calcularPMV() {
    const metTotal = this.calcularMetTotal();

    // Definir la constante de ajuste (Resistencia ropa, resistencia piel)
    const constanteAjuste = 0.5;
    const metSensible = (1 / (1 + constanteAjuste)) * metTotal;

    const areaSuperficie = 1.8; // Área de la superficie de la persona (m²)
    const resistenciaVestimenta = 0.5; // Resistencia térmica de la vestimenta (clo)
    const resistenciaAislamiento = 0.155; // Resistencia térmica del aislamiento (clo)

    // Cálculo del PMV según la fórmula simplificada
    const pmv = 0.303 * Math.exp(-0.036 * metTotal) + 0.028 * metTotal - metSensible * areaSuperficie * (Math.exp(0.063 * metTotal) - 1) + (0.42 * metTotal - metSensible * areaSuperficie) / (resistenciaVestimenta + resistenciaAislamiento);

    this.pmv = pmv;
    
    this.crearSugerencia(pmv);
    
    // Definir umbrales de confort
    const umbralesConfort = {
      muchoCalor: 3.7,
      bastanteCalor: 3.6,
      algoCalor: 3.5,
      neutro: 3.4,
      algoFrio: 3.3,
      bastanteFrio: 3.2,
      muchoFrio: 3.1
    };

    // Clasificar el estado de confort según los umbrales
    if (pmv >= umbralesConfort.muchoCalor) {

      this.mensaje = "Mucho calor";
      return "Mucho calor";
    } else if (pmv >= umbralesConfort.bastanteCalor) {
      this.mensaje = "Bastante calor";
      return "Bastante calor";
    } else if (pmv >= umbralesConfort.algoCalor) {
      this.mensaje = "Algo de calor";
      return "Algo de calor";
    } else if (pmv >= umbralesConfort.neutro) {
      this.mensaje = "Neutro";
      return "Neutro";
    } else if (pmv >= umbralesConfort.algoFrio) {
      this.mensaje = "Algo de frío";
      return "Algo de frío";
    } else if (pmv >= umbralesConfort.bastanteFrio) {
      this.mensaje = "Bastante frío";
      return "Bastante frío";
    } else {
      this.mensaje = "Mucho frío";
      return "Mucho frío";
    }
  }

  crearSugerencia(pmv)
  {
    //Ropa ligera
    if (this.resistenciaVestimenta == 0 && this.resistenciaVestimenta == 0.5) {
      //Actividad baja
      if (this.actividadMetabolica <= 2) {
        if (sensacion >= 3.5) {
          this.sugerencia = "Está bastante caluroso, es recomendable bajar la temperatura por medio de ventilacion externa";
        }
        else if (sensacion <= 3.3) {
          this.sugerencia = "Está bastante frío, es recomendable tener ropa abrigada, cerrar las ventanas y un calefactor";
        } else {
          this.sugerencia = "La sensación térmica es confortable"
        }
      } else
      //Actividad alta
      if (this.actividadMetabolica >= 2) {
        if (sensacion >= 3.5) {
          this.sugerencia = "Está bastante caluroso, es recomendable hacer una actividad física menos demandante";
        }else if(sensacion <= 3.3){
          this.sugerencia = "Está bastante frío, es recomendable tener ropa abrigada";
        }else{
          this.sugerencia = "La sensación térmica es confortable"
        }
      }
      //Actividad media
      else {
        if (sensacion >= 3.5) {
          this.sugerencia = "Está bastante caluroso, es recomendable tener ropa más ligera";
        }else if(sensacion <= 3.3){
          this.sugerencia = "Está bastante frío, es recomendable tener ropa abrigada"
        }else{
          this.sugerencia = "La sensación térmica es confortable"
        }
      }
    //Ropa pesada
    } else if (this.resistenciaVestimenta == 1 && this.resistenciaVestimenta == 1.5) {
      //Actividad baja
      if (this.actividadMetabolica <= 2) {
        if (sensacion >= 3.5) {
          this.sugerencia = "Está bastante caluroso, se recomienda cambiar a ropa más ligera"
        }else if(sensacion <= 3.3){
          this.sugerencia = "Está bastante frío, se recomienda encender la calefaccion"
        }else{
          this.sugerencia = "La sensación térmica es confortable"
        }
      } else
      //Actividad alta
      if (this.actividadMetabolica >= 2) {
        if (sensacion >= 3.5) {
          this.sugerencia = "Está bastante caluroso, se recomienda no hacer actividades demandantes y/o cambiar a ropa más ligera"
        }else if(sensacion <= 3.3){
          this.sugerencia = "Está bastante frío, se recomienda encender la calefaccion"
        }else{
          this.sugerencia = "La sensación térmica es confortable"
        }
      }
      //Actividad media
      else {
        if (sensacion >= 3.5) {
          this.sugerencia = "Está bastante caluroso, se recomienda cambiar a ropa más ligera o cambiar el tipo de actividad"
        }else if(sensacion <= 3.3){
          this.sugerencia = "Esta bastante frío, se recomienda encender la calefaccion o hacer una actividad que demande ´más"
        }else{
          this.sugerencia = "La sensación térmica es confortable"
        }
      }
    }
  }
  
  calcularMetTotal() {
    const temperaturaOperativa = this.temperatura; // Para simplificar, consideramos la temperatura operativa igual a la temperatura del aire
    const humedadRelativa = this.humedadRelativa;
    const velocidadAire = this.velocidadAire;

    const factorTemperatura = 0.03;
    const factorHumedad = 0.008;
    const factorVelocidadAire = 0.03;

    const metTotal = this.actividadMetabolica +
      factorTemperatura * temperaturaOperativa +
      factorHumedad * humedadRelativa +
      factorVelocidadAire * velocidadAire;

    return metTotal * (-1);
  }
}

module.exports = Habitacion;