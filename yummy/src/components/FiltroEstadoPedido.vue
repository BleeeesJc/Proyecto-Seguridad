<template>
    <div class="filtro-estado-botones">
      <button
        v-for="opcion in opciones"
        :key="opcion.valor"
        :class="{ activo: opcion.valor === estadoSeleccionado }"
        @click="cambiarEstado(opcion.valor)"
      >
        {{ opcion.texto }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: "FiltroEstadoPedido",
    props: {
      estadoInicial: {
        type: Number,
        default: 0, // Por defecto, "En espera"
      },
    },
    data() {
      return {
        estadoSeleccionado: this.estadoInicial,
        opciones: [
          { valor: 0, texto: "En espera" },
          { valor: 1, texto: "Entregado" },
          { valor: 3, texto: "Pagados" },
          { valor: 2, texto: "Cancelados" },
        ],
      };
    },
    methods: {
      cambiarEstado(nuevoEstado) {
        this.estadoSeleccionado = nuevoEstado;
        this.$emit("cambioEstado", nuevoEstado);
      },
    },
  };
  </script>
  
  <style scoped>
  .filtro-estado-botones {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  button {
    padding: 10px 15px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1em;
    background-color: #ffe59e; /* Color neutro */
    color: #000;
    transition: background-color 0.3s, color 0.3s;
  }
  
  button.activo {
    background-color: #ffa500; /* Color activo (naranja) */
    color: #fff;
    font-weight: bold;
  }
  
  button:hover {
    background-color: #ffcc00; /* Efecto hover */
  }
  </style>
  