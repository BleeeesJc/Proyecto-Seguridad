<template>
    <div class="calificaciones-container">
      <h1>Mis Calificaciones</h1>
  
      <!-- Mostrar error si existe -->
      <div v-if="error" class="error-card">
        <p>{{ error }}</p>
      </div>
  
      <!-- Mostrar las tarjetas de calificaciones -->
      <div v-if="calificaciones.length > 0" class="calificaciones-grid">
        <CardMenuWithRating
            v-for="calificacion in calificaciones"
            :key="calificacion.idresenia"
            :idresenia="calificacion.idresenia"
            :imagen="calificacion.imagen"
            :nombre="calificacion.platillo"
            :descripcion="calificacion.descripcion"
            :rating-inicial="calificacion.puntuacion"
            :idusuario="idusuario"
            :idplato="calificacion.idplato"
            @updated="handleUpdated"
            @deleted="handleDeleted"
        />

      </div>
  
      <!-- Si no hay calificaciones -->
      <p v-else>No has calificado ningún platillo aún.</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import CardMenuWithRating from "../components/CardMenuCalificacion.vue";
  
  export default {
    name: "MisCalificaciones",
    components: {
      CardMenuWithRating,
    },
    data() {
    return {
        calificaciones: [], // Datos de las calificaciones
        error: null,
        idusuario: localStorage.getItem("id") ? parseInt(localStorage.getItem("id"), 10) : null,
    };
    },

    methods: {
      async cargarCalificaciones() {
        try {
          const idusuario = localStorage.getItem("id");
          if (!idusuario) {
            this.error = "No se encontró un usuario logueado.";
            return;
          }
  
          const response = await axios.get(`/api/calificaciones/usuario/${idusuario}`);
          this.calificaciones = response.data;
        } catch (err) {
          console.error("Error al cargar las calificaciones:", err);
          this.error = "Ocurrió un error al cargar tus calificaciones.";
        }
      },
      handleRating({ nombre, rating }) {
        console.log(`Nueva calificación para ${nombre}: ${rating} estrellas`);
       
      },
      handleUpdated({ idresenia, rating }) {
        const calificacion = this.calificaciones.find(c => c.idresenia === idresenia);
        if (calificacion) {
        calificacion.puntuacion = rating; 
        }
    },
    handleDeleted(idresenia) {
        this.calificaciones = this.calificaciones.filter(c => c.idresenia !== idresenia);
    },
    },
    mounted() {
      this.cargarCalificaciones();
    },
  };
  </script>
  
  <style scoped>
  .calificaciones-container {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .error-card {
    background-color: #ffe5e5;
    color: #ff0000;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  
  .calificaciones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    justify-content: center;
  }
  </style>
  