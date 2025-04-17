<template>
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="rating-card">
          <h2>Califica tu experiencia</h2>
          <div class="stars">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ active: star <= rating }"
              @click="setRating(star)"
            >
              ★
            </span>
          </div>
          <button class="submit-button" @click="submitRating">enviar</button>
        </div>
        <button class="close-button" @click="close">X</button>
      </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
  name: "ExpCalificacion",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close", "submitted"],
  data() {
    return {
      rating: 0,
    };
  },
  methods: {
    setRating(star) {
      this.rating = star;
    },
    async submitRating() {
      try {
        const idusuario = localStorage.getItem("id"); // Usuario logueado
        if (!idusuario) {
          alert("No se encontró un usuario logueado.");
          return;
        }

        const fecha = new Date().toISOString().split("T")[0]; // Fecha actual

        await axios.post("/api/calificaciones/calificar-experiencia", {
          puntuacion: this.rating,
          idusuario: parseInt(idusuario, 10),
          fecha: fecha,
        });

        this.$emit("submitted", this.rating);
        this.close();
      } catch (error) {
        console.error("Error al enviar la calificación:", error);
        alert("Hubo un problema al guardar tu calificación.");
      }
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

  
<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #fffedc;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    padding: 20px;
    width: 350px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  .rating-card {
    background-color: #fffedc;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    font-family: Arial, sans-serif;
  }
  
  h2 {
    color: #724a0e;
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .stars {
    display: flex;
    justify-content: center;
    margin-bottom: 2vh;
  }
  
  .star {
    font-size: 6vh;
    cursor: pointer;
    color: #d3d3d3;
    transition: color 0.3s ease;
  }
  
  .star.active {
    color: #724a0e;
  }
  

  .star:hover ~ .star {
  color: #d3d3d3; /* Aseguramos que las estrellas posteriores permanezcan grises */
}
  
  .submit-button {
    background-color: #ffab5e;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .submit-button:hover {
    background-color: #e69a4c; /* Un tono más oscuro en hover */
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
</style>
  