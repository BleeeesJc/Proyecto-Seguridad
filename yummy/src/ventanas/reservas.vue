<template>
    <div class="container mt-5">
      <h2 class="text-center">Reservas</h2>
  
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID Reserva</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Cantidad de Personas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="reservas.length === 0">
            <td colspan="5" class="text-center">No hay reservas disponibles.</td>
          </tr>
          <tr v-for="reserva in reservas" :key="reserva.idReserva">
            <td>{{ reserva.idReserva }}</td>
            <td>{{ reserva.nombre }}</td>
            <td>{{ reserva.fecha }}</td>
            <td>{{ reserva.hora }}</td>
            <td>{{ reserva.cantidadPersonas }}</td>
          </tr>
        </tbody>
      </table>
  
      <a href="index.html" class="btn-back">Volver</a>
    </div>
  </template>
  
  <script>

  export default {
    name: "ReservasPage",
    components: {

      
    },
    data() {
      return {
        reservas: [], // Aquí almacenarás las reservas
      };
    },
    mounted() {
      this.cargarReservas(); // Cargar reservas cuando el componente se monta
    },
    methods: {
      async cargarReservas() {
        // Aquí puedes hacer una llamada a tu API para obtener las reservas
        // Este es un ejemplo de cómo podrías hacerlo:
        try {
          const response = await fetch('tu-api-de-reservas'); // Reemplaza con tu endpoint
          const data = await response.json();
          this.reservas = data; // Asigna los datos a la propiedad reservas
        } catch (error) {
          console.error('Error al cargar las reservas:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 10px;
  }
  .table {
    margin-top: 20px;
  }
  .table th, .table td {
    text-align: center;
  }
  .btn-back {
    background-color: #c89b3f; 
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    display: block;
    margin: 20px auto;
  }
  .btn-back:hover {
    background-color: #8c6f25; 
  }
  </style>
  