<template>
    <div class="error-card" v-if="visible">
      <p>{{ mensaje }}</p>
      <button @click="cerrar" class="cerrar-boton">✖</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "ErrorCard",
    props: {
      mensaje: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        visible: true // Control de visibilidad
      };
    },
    methods: {
      cerrar() {
        this.visible = false; // Ocultar la tarjeta
      }
    }
  };
  </script>
  
  <style scoped>
  .error-card {
    background-color: #ffe8e8; /* Fondo rojo suave */
    color: #b00020; /* Texto rojo oscuro */
    border: 1px solid #b00020;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: fade-in 0.3s ease-in-out;
  }
  
  .error-card p {
    margin: 0;
    font-size: 1rem;
  }
  
  .cerrar-boton {
    background: transparent;
    border: none;
    font-size: 1.2rem;
    color: #b00020;
    cursor: pointer;
    padding: 0.2rem;
  }
  
  .cerrar-boton:hover {
    color: #900014;
  }
  
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  