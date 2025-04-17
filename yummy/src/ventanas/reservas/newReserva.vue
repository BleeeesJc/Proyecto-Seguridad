<template>
    <div class="modal-success">
      <div class="modal-content">
        <span class="close-button" @click="onClose">&times;</span>
        <h2>{{ titulo }}</h2>
  
        

        <!-- Mensaje de error -->
        <div v-if="error" class="error-card">
          <p>{{ error }}</p>
        </div>
  
        <!-- Formulario para nueva reserva -->
        <form @submit.prevent="guardarReserva">
          <div class="form-group">
            <label for="idUsuario">ID Usuario:</label>
            <input type="text" id="idUsuario" v-model="reservaData.idusuario" placeholder="Ingrese ID del usuario" />
            <button @click.prevent="continuarSinUsuario" class="sin-usuario-button">
              Continuar sin usuario
            </button>
          </div>
  
          <div class="form-group">
            <label for="fecha">Fecha:</label>
            <input type="date" id="fecha" v-model="reservaData.fecha" required />
          </div>
  
          <div class="form-group">
            <label for="hora">Hora:</label>
            <input type="time" id="hora" v-model="reservaData.hora" required />
          </div>
  
          <div class="form-group">
            <label for="mesa">Mesa:</label>
            <input type="text" id="mesa" v-model="reservaData.idmesa" required placeholder="Ingrese número de mesa" />
          </div>
  
          <button type="submit" class="save-button" :disabled="loading">{{ loading ? "Guardando..." : "Guardar Reserva" }}</button>
          
        </form>
      </div>
      <SuccessModal
        v-if="mostrarExito"
        :mensaje="'Reserva guardada exitosamente.'"
        @onClose="cerrarModalExito"
      />
    </div>
  </template>
  
<script>
  import { reactive, ref } from "vue";
  import axios from "axios";
  import SuccessModal from "@/components/SuccessModal.vue";

  export default {
    name: "NuevaReserva",
    components: { SuccessModal },
    props: {
      titulo: String,
    },
    emits: ["onClose", "onSave"],
    setup(props, { emit }) {
      const error = ref(null);
      const loading = ref(false);
      const mostrarExito = ref(false); // Controla la visibilidad del modal de éxito

      const reservaData = reactive({
        idusuario: "", // Campo inicial para ID del usuario
        fecha: "",
        hora: "",
        idmesa: "",
      });

      const continuarSinUsuario = () => {
        reservaData.idusuario = 1; // Usuario por defecto
      };

      const guardarReserva = async () => {
        if (loading.value) return;
        loading.value = true;
        try {
          error.value = null;

          const { idusuario, idmesa, fecha, hora } = reservaData;

          // Verificar disponibilidad de la mesa
          const response = await fetch(
            `/api/reservas/verificar-disponibilidad?idmesa=${idmesa}&fecha=${fecha}&hora=${hora}&idreserva=${""}`
          );

          if (!response.ok) {
            const errorResponse = await response.json();
            error.value = errorResponse.error || "Error en la solicitud de disponibilidad.";
            return;
          }

          const { disponible } = await response.json();

          // Verificar si el usuario está registrado
          const responseU = await fetch(`/api/reservas/verificar-usuario?idusuario=${reservaData.idusuario}`);
          if (!responseU.ok) {
            const errorResponse = await responseU.json();
            error.value = errorResponse.error || "Error en la verificación del usuario.";
            return;
          }

          const { registrado } = await responseU.json();

          if (!registrado) {
            error.value = "El usuario no está registrado. Puede continuar sin un usuario registrado.";
            return;
          }

          if (!disponible) {
            error.value =
              "La mesa seleccionada ya tiene una reserva en la misma fecha y hora (o dentro de 1 hora y media).";
            return;
          }

          // Proceder a guardar la reserva
          const nuevaReserva = {
            idusuario: idusuario || 1,
            idmesa,
            fecha,
            hora,
            estado: 1, // Por defecto, pendiente
          };

          // Simular guardar la reserva (usa aquí tu llamada al backend si la tienes)
          console.log("Reserva guardada:", nuevaReserva);

          // Emitir evento y mostrar modal de éxito
          emit("onSave", nuevaReserva);
          mostrarExito.value = true; // Mostrar el modal de éxito
        } catch (err) {
          console.error("Error al guardar la reserva:", err);
          error.value = "Ocurrió un error al guardar la reserva.";
        } finally {
          loading.value = false; // Restablece el estado de carga
        }
      };

      const cerrarModalExito = () => {
        mostrarExito.value = false; // Ocultar el modal de éxito
        emit("onClose"); // Cerrar el modal principal
      };

      return { reservaData, guardarReserva, continuarSinUsuario, error, onClose: cerrarModalExito, loading, mostrarExito };
    },
  };

</script>
  
  <style scoped>
  .modal-success {
    width: 100%;
    padding-left: 25%;
    padding-right: 25%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1005;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    position: relative;
    width: 100%;
    max-width: 400px;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
  }
  .form-group {
    margin-bottom: 1rem;
    text-align: left;
  }
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  .form-group input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .error-card {
    background: #ffe5e5;
    color: #ff0000;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  .sin-usuario-button {
    background-color: #ffab5e;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin-top: 5px;
    border-radius: 4px;
    cursor: pointer;
  }
  .sin-usuario-button:hover {
    background-color: #ff5722;
  }
  .save-button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .save-button:hover {
    background-color: #45a049;
  }
  </style>
  