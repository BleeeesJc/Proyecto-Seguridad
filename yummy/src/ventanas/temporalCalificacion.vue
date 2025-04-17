<template>
    <div>
      <button @click="openModal" class="open-modal-button">Abrir Modal</button>
      <StarRatingModal
        :show="isModalOpen"
        @close="closeModal"
        @submitted="handleSubmitted"
      />
      <!-- Botón para abrir el modal del platillo -->
    <button @click="openModalPlatillo('Tacos al Pastor')" class="open-modal-button">
      Calificar Platillo
    </button>
    <StarRatingModalPlatillo
      :show="isModalPlatilloOpen"
      :platillo="platilloActual"
      @close="closeModalPlatillo"
      @submitted="handleSubmittedPlatillo"
    />
    </div>
  </template>
  
  <script>
  import StarRatingModal from "../components/ExpCalificacion.vue";
  import StarRatingModalPlatillo from "../components/PlatilloCalificacion.vue";
  

  export default {
    name: "TemporalCalificacion",
    components: {
      StarRatingModal,
      StarRatingModalPlatillo,
    },
    data() {
      return {
        isModalOpen: false,
        isModalPlatilloOpen:false,
        platilloActual: "",
      };
    },
    methods: {
      openModal() {
        this.isModalOpen = true;
      },
      closeModal() {
        this.isModalOpen = false;
      },

      
      handleSubmitted(rating) {
        console.log("Calificación enviada:", rating);
       
      },


        openModalPlatillo(platillo) {
            this.platilloActual = platillo; // Define el platillo actual
            this.isModalPlatilloOpen = true;
        },
        closeModalPlatillo() {
            this.isModalPlatilloOpen = false;
        },
        handleSubmittedPlatillo({ platillo, rating }) {
        console.log(`Calificación enviada: ${rating} para ${platillo}`);
        // Aquí puedes manejar la lógica de envío o guardado
        },
    },
  };
  </script>
  
  <style scoped>
  .open-modal-button {
    background-color: #ffab5e;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .open-modal-button:hover {
    background-color: #e69a4c;
  }
  </style>
  