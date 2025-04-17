
<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <span class="close-button" @click="$emit('onClose')">&times;</span>
        <h2 class="titulo">Tu Pedido</h2>

        <div class="pedido-items">
          <div class="pedido-item-header">
            <span>Plato</span>
            <span>Precio</span>
            <span>Cant</span>
            <span>Subtotal</span>
          </div>
          <div v-for="(item, index) in items" :key="index" class="pedido-item">
            <span>{{ item.nombre }}</span>
            <span>Bs. {{ item.precio }}</span>
            <span>{{ item.cantidad }}</span>
            <span>Bs. {{ item.precio * item.cantidad }}</span>
          </div>
        </div>
  
        <!-- Total -->
        <div class="total">
          <span>Total:</span>
          <span>Bs. {{ total }}</span>
        </div>
  
        <!-- Botón para realizar pedido -->
        <button class="realizar-pedido-button" @click="realizarPedido">Realizar pedido</button>
      </div>
    </div>
  </template>
  
  <script>
  import ExpCalificacion from '@/components/ExpCalificacion.vue';
  export default {
    name: "ModalPedido",
    components: {
      ExpCalificacion,
    },
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    computed: {
      total() {
        return this.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
      }
    },
    methods: {
      realizarPedido() {
        // Emitimos el evento para realizar el pedido
        this.$emit('onRealizarPedido');
        // Cierra el modal
        this.$emit('onClose');
      }
      
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: #FFFEDC;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    position: relative;
    text-align: center;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
    color: #8B5E3C;
  }
  
  .titulo {
    font-size: 2rem;
    color: #8B5E3C;
    font-weight: bold;
    margin-bottom: 20px;
    font-family: 'Roboto Condensed', sans-serif;
  }
  
  .pedido-items {
    margin-bottom: 20px;
  }
  
  .pedido-item-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    color: #8B5E3C;
    margin-bottom: 10px;
  }
  
  .pedido-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid #ddd;
  }
  
  .total {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1.2rem;
    color: #8B5E3C;
    margin-top: 20px;
  }
  
  .realizar-pedido-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #A16F23;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .realizar-pedido-button:hover {
    background-color: #8B5E3C;
  }
  </style>
  