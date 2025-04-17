<template>
  <div class="pedidos-container">
    <h1>Mis Pedidos</h1>

    <!-- Mostrar error si existe -->
    <div v-if="error" class="error-card">
      <p>{{ error }}</p>
    </div>

    <!-- Mostrar tarjetas de pedidos -->
    <div v-if="pedidos.length > 0" class="pedidos-list">
      <div
        v-for="pedido in pedidos"
        :key="pedido.idpedido"
        :class="['pedido-card', getEstadoClase(pedido.estado)]"
      >
        <h3>{{ getEstadoTexto(pedido.estado) }}</h3>
        <p>Fecha: {{ formatFecha(pedido.fecha) }}</p>
        <p>Hora: {{ pedido.hora }}</p>
        <p>Precio Total: ${{ pedido.precio_total.toFixed(2) }}</p>
        <div class="acciones">
          <!-- Botón para ver detalles del pedido -->
          <button @click="verDetallesPedido(pedido.idpedido, pedido.estado)" class="detalle-btn">Ver Detalles</button>

          <!-- Botón para cancelar el pedido si está pendiente -->
          <button 
            v-if="pedido.estado === 0" 
            @click="cancelarPedido(pedido.idpedido)" 
            class="accion-btn cancelar"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Si no hay pedidos -->
    <p v-else>No tienes pedidos en este momento.</p>

    <!-- Modal para mostrar detalles del pedido -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal-content">
        <span class="close-button" @click="cerrarModal">&times;</span>
        <h2>Detalles del Pedido</h2>
        <ul>
          <li v-for="detalle in detallesPedido" :key="detalle.iddetalle">
            <p><strong>Platillo:</strong> {{ detalle.platillo }}</p>
            <p><strong>Cantidad:</strong> {{ detalle.cantidad }}</p>

            <!-- Botón para calificar si el pedido está entregado -->
            <button
              v-if="estadoPedido === 1"
              class="calificar-btn"
              @click="abrirCalificacionModal(detalle.platillo, detalle.idplato)"
            >
              Calificar
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Modal para calificación -->
    <StarRatingModalPlatillo
      v-if="mostrarCalificacionModal"
      :show="true"
      :platillo="platilloSeleccionado.nombre"
      @close="mostrarCalificacionModal = false"
      @submitted="manejarCalificacion"
    />

  </div>
</template>

<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import StarRatingModalPlatillo from '../components/PlatilloCalificacion.vue';



export default {
  name: 'MisPedidos',
  setup() {
    const pedidos = ref([]);
    const detallesPedido = ref([]);
    const mostrarModal = ref(false);
    const mostrarCalificacionModal = ref(false);
    const platilloSeleccionado = ref({}); // Contiene el nombre y el id del platillo
    const estadoPedido = ref(null); // Estado del pedido actualmente abierto
    const error = ref(null);

    const abrirCalificacionModal = (nombre, idplato) => {
      platilloSeleccionado.value = { nombre, idplato };
      mostrarCalificacionModal.value = true;
      console.log('Modal abierto para:', platilloSeleccionado.value);
    };


    const manejarCalificacion = async ({ rating }) => {
      try {
        const idusuario = localStorage.getItem('id');
        if (!idusuario) {
          alert("Usuario no autenticado. No se puede guardar la calificación.");
          return;
        }

        await axios.post('/api/calificaciones', {
          puntuacion: rating,
          idusuario: parseInt(idusuario, 10),
          idplato: platilloSeleccionado.value.idplato,
        });

        alert(`Calificación de ${rating} estrellas guardada para ${platilloSeleccionado.value.nombre}`);
      } catch (error) {
        console.error('Error al enviar la calificación:', error);
        alert('Hubo un problema al guardar tu calificación.');
      } finally {
        mostrarCalificacionModal.value = false;
      }
    };

    const cargarPedidos = async () => {
      try {
        const idUsuario = localStorage.getItem('id');
        if (!idUsuario) {
          error.value = 'No se encontró un usuario logueado.';
          return;
        }

        const response = await axios.get(`/api/pedidos/usuario/${idUsuario}`);
        pedidos.value = response.data;
      } catch (err) {
        console.error('Error al cargar pedidos:', err);
        error.value = 'Ocurrió un error al cargar tus pedidos.';
      }
    };

    const verDetallesPedido = async (idPedido, estado) => {
      try {
        const response = await axios.get(`/api/detalle_pedido/pedido?pedido=${idPedido}`);
        detallesPedido.value = response.data;
        estadoPedido.value = estado; // Almacena el estado del pedido principal
        mostrarModal.value = true;
      } catch (err) {
        console.error('Error al cargar detalles del pedido:', err);
        error.value = 'Ocurrió un error al cargar los detalles del pedido.';
      }
    };

    const cerrarModal = () => {
      mostrarModal.value = false;
      detallesPedido.value = [];
      estadoPedido.value = null; // Resetea el estado
    };

    const cancelarPedido = async (idPedido) => {
      try {
        await axios.put(`/api/pedidos/cancelar/${idPedido}`);
        alert('Pedido cancelado exitosamente.');
        cargarPedidos();
      } catch (err) {
        console.error('Error al cancelar pedido:', err);
        error.value = 'Error al cancelar el pedido.';
      }
    };

    const getEstadoTexto = (estado) => {
      switch (estado) {
        case 0: return 'Pedido pendiente';
        case 1: return 'Pedido entregado';
        case 2: return 'Pedido cancelado';
        case 3: return 'Pedido pagado';
        default: return 'Estado desconocido';
      }
    };

    const getEstadoClase = (estado) => {
      switch (estado) {
        case 0: return 'pendiente';
        case 1: return 'entregado';
        case 2: return 'cancelado';
        case 3: return 'pagado';
        default: return '';
      }
    };

    const formatFecha = (fecha) => {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    onMounted(cargarPedidos);

    return {
      pedidos,
      detallesPedido,
      mostrarModal,
      mostrarCalificacionModal,
      platilloSeleccionado,
      estadoPedido,
      error,
      abrirCalificacionModal,
      manejarCalificacion,
      cargarPedidos,
      verDetallesPedido,
      cerrarModal,
      cancelarPedido,
      getEstadoTexto,
      getEstadoClase,
      formatFecha,
    };
  },
};
</script>

<style scoped>

  .pedidos-container {
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
  
  .pedidos-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
  
  .pedido-card {
    width: 300px;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .pendiente {
    background-color: #fffedc;
  }
  
  .entregado {
    background-color: #e2ffe2;
  }
  
  .cancelado {
    background-color: #ffe2e2;
  }
  
  .pagado {
    background-color: #e2e2ff;
  }
  
  h3 {
    color: #333;
    margin-bottom: 10px;
  }
  
  .acciones {
    margin-top: 15px;
  }
  
  button {
    border: none;
    padding: 8px 12px;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .detalle-btn {
    background-color: #a16f23;
    color: white;
  }
  
  .cancelar {
    background-color: #f44336;
    color: white;
  }
  
  /* Modal estilos */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 500px;
    text-align: left;
    position: relative;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
  }
  .calificar-btn {
    background-color: #ffab5e;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .calificar-btn:hover {
    background-color: #e69a4c;
  }

</style>
  