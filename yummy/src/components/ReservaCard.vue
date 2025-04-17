<template>
  <div :class="['reserva-card', estadoClase]" @click="abrirModal">
    <h3 class="mesa">{{ mesa }}</h3>
    <p>Fecha: {{ fecha }}</p>
    <p>Hora: {{ hora }}</p>
    <p>Nombre: {{ nombre }}</p>
    <!-- Botón para cambiar el estado -->
    <button :class="['estado', estadoClase]" @click.stop="toggleEstado">
      {{ estado === '1' ? 'Pendiente' : 'Finalizada' }}
    </button>
  </div>
</template>

<script>
export default {
  name: "ReservaCard",
  props: {
    mesa: String,
    fecha: String,
    hora: String,
    nombre: String,
    estado: String, // Recibe el estado como "0" o "1" desde el padre
  },
  computed: {
    estadoClase() {
      // Clase CSS según el estado
      return this.estado === '1' ? 'pendiente' : 'finalizada';
    },
  },
  methods: {
    toggleEstado() {
      // Cambiar el estado localmente entre "0" (Entregado) y "1" (Pendiente)
      const nuevoEstado = this.estado === '1' ? '0' : '1';
      this.$emit("cambiarEstado", nuevoEstado); // Emitir evento para el cambio de estado
    },
    abrirModal() {
      this.$emit("abrirModal"); // Emitir evento para abrir el modal
    },
  },
};
</script>
  
<style scoped>
  .reserva-card {
    width: 200px;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    margin: 10px;
    text-align: center;
  }
  
  .mesa {
    font-size: 1.2rem;
    color: #8B5E3C; /* Color marrón */
    font-weight: bold;
  }
  
  .finalizada {
    background-color: #FFFEDC; /* Color de fondo para estado "Entregada" */
  }
  
  .pendiente {
    background-color: #F5F5F5; /* Color de fondo para estado "Pendiente" */
  }
  
  .estado {
    margin-top: 12px;
    padding: 6px 12px;
    font-size: 0.9rem;
    border: none;
    border-radius: 8px;
    color: #666;
    cursor: pointer;
  }
  
  .finalizada.estado {
    background-color: #D8D8A7; /* Color para botón de estado "Entregada" */
  }
  
  .pendiente.estado {
    background-color: #D3D3D3; /* Color para botón de estado "Pendiente" */
  }
</style>
  