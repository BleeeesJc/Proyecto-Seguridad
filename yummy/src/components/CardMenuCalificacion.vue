<template>
    <div class="menu-card">
      <!-- Imagen y descripción del platillo -->
      <div class="card-content">
        <img :src="imagen" alt="plato" class="imagen" />
        <br />
        <h3>{{ nombre }}</h3>
        <p>{{ descripcion }}</p>
      </div>
  
      <!-- Estrellas para calificar -->
      <div class="stars">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ active: star <= rating, editable: isEditable }"
          @click="isEditable ? setRating(star) : null"
        >
          ★
        </span>
      </div>
  
      <!-- Botones de acción -->
      <div class="card-actions">
        <button v-if="!isEditable" class="modify-btn" @click="enableEdit">Modificar</button>
        <button v-else class="save-btn" @click="saveChanges">Guardar</button>
        <button class="delete-btn" @click="eliminarResenia">Eliminar</button>
      </div>
      
    </div>
    <SuccessModal
        v-if="mostrarModal"
        :mensaje="mensajeModal"
        @onClose="mostrarModal = false"
      />
    <ConfirmationModal
        v-if="mostrarConfirmationModal"
        mensaje="¿Estás seguro de que deseas eliminar esta calificación?"
        @onCancel="cancelarEliminacion"
        @onConfirm="confirmarEliminacion"
        />


  </template>
  
<script>
  import axios from "axios";
  import SuccessModal from "../components/SuccessModal.vue";
  import ConfirmationModal from "./ConfirmationModal.vue";
  
  export default {
    name: "CardMenuWithRating",
    components: { SuccessModal, ConfirmationModal },
    props: {
      idresenia: {
        type: Number,
        required: true,
      },
      imagen: {
        type: String,
        required: true,
      },
      nombre: {
        type: String,
        required: true,
      },
      descripcion: {
        type: String,
        required: true,
      },
      ratingInicial: {
        type: Number,
        default: 0,
      },
      idusuario: {
        type: Number,
        required: true,
      },
      idplato: {
        type: Number,
        required: true,
      },
    },
    data() {
        return {
            rating: this.ratingInicial,
            isEditable: false,
            editando: null,
            mostrarModal: false, 
            mensajeModal: "", 
            mostrarConfirmationModal: false,
        };
    },

    methods: {
      setRating(star) {
        this.rating = star; 
      },
      enableEdit() {
        this.isEditable = true;
        this.editando = {
          idplato: this.idplato,
          nombre: this.nombre,
          rating: this.rating,
        }; 
        console.log("Editando plato:", this.editando);
      },
      async saveChanges() {
        try {
          if (!this.idusuario || !this.idplato) {
            alert("Faltan datos para actualizar la calificación.");
            return;
          }
  
          console.log("Guardando cambios para el plato:", this.editando);
  
      
          const existeResenia = await axios.get(`/api/calificaciones/existe`, {
            params: {
              idusuario: this.idusuario,
              idplato: this.idplato,
            },
          });
  
          console.log("Respuesta de la verificación:", existeResenia.data);
  
          if (existeResenia.data.existe) {
           
            await axios.put(`/api/calificaciones/actualizar`, {
              puntuacion: this.rating,
              idusuario: this.idusuario,
              idplato: this.idplato,
            });
            this.mensajeModal = `Calificación actualizada a ${this.rating} estrellas`;
          } else {
           
            await axios.post(`/api/calificaciones`, {
              puntuacion: this.rating,
              idusuario: this.idusuario,
              idplato: this.idplato,
            });
            this.mensajeModal = `Calificación creada con ${this.rating} estrellas`;
          }
  
          this.isEditable = false;
          this.editando = null; 
          this.mostrarModal = true;
          this.$emit("updated", { idresenia: this.idresenia, rating: this.rating });
        } catch (error) {
          console.error("Error al guardar la calificación:", error);
          alert("Hubo un problema al guardar la calificación.");
        }
      },
      async eliminarResenia() {
    this.mostrarConfirmationModal = true; 
  },
    async confirmarEliminacion() {
        try {
        await axios.delete(`/api/calificaciones/${this.idresenia}`);
        this.mensajeModal = `La calificación de ${this.nombre} fue eliminada.`;
        this.mostrarModal = true; 
        this.mostrarConfirmationModal = false; 
        this.$emit("deleted", this.idresenia); 
        } catch (error) {
        console.error("Error al eliminar la calificación:", error);
        alert("Hubo un problema al eliminar la calificación.");
        }
    },
    cancelarEliminacion() {
        this.mostrarConfirmationModal = false;
    },
    
  },
  };
</script>
  
<style scoped>
  .menu-card {
    background-color: #fffedc;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 15px;
    text-align: center;
    font-family: Arial, sans-serif;
    max-width: 250px;
  }
  
  .card-content {
    margin-bottom: 10px;
  }
  
  .imagen {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 8px;
  }
  
  h3 {
    font-size: 18px;
    color: #724a0e;
  }
  
  p {
    font-size: 14px;
    color: #5e5e5e;
  }
  
  .stars {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }
  
  .star {
    font-size: 22px;
    cursor: pointer;
    color: #d3d3d3;
    transition: color 0.3s ease;
  }
  
  .star.active {
    color: #724a0e;
  }
  
  .star.editable:hover {
    color: #724a0e;
  }
  
  .card-actions {
    display: flex;
    justify-content: space-around;
  }
  
  .modify-btn,
  .save-btn,
  .delete-btn {
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
  }
  
  .modify-btn,
  .save-btn {
    background-color: #ffab5e;
    color: white;
  }
  
  .modify-btn:hover,
  .save-btn:hover {
    background-color: #e69a4c;
  }
  
  .delete-btn {
    background-color: #f44336;
    color: white;
  }
  
  .delete-btn:hover {
    background-color: #d32f2f;
  }
</style>
  