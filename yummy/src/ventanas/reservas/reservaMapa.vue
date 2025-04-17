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
            <label for="fecha">Fecha:</label>
            <input type="date" id="fecha" v-model="reservaData.fecha" required />
          </div>
  
          <div class="form-group">
            <label for="hora">Hora:</label>
            <input type="time" id="hora" v-model="reservaData.hora" required />
          </div>
  
          <button type="submit" class="save-button">Guardar Reserva</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive, ref, onMounted } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2'; // Asegúrate de importar SweetAlert2
  
  export default {
    name: "NuevaReserva",
    props: {
      titulo: String,
      idmesa: Number,
    },
    emits: ['onClose', 'onSave'],
    setup(props, { emit }) {
      const error = ref(null);
  
      const reservaData = reactive({
        idusuario: "", // Campo inicial para ID del usuario
        fecha: "",
        hora: "",
        idmesa: props.idmesa,
      });
  
      // Asignar el idusuario desde localStorage al cargar el componente
      onMounted(() => {
        const usuarioId = localStorage.getItem("id"); // Cambia "idusuario" al nombre exacto de tu key
        if (usuarioId) {
          reservaData.idusuario = parseInt(usuarioId, 10); // Asegúrate de convertirlo a número
        } else {
          console.warn("No se encontró idusuario en el localStorage. Usando valor predeterminado.");
          reservaData.idusuario = 1; // Valor predeterminado
        }
      });
  
      // Continuar sin usuario registrado
      const continuarSinUsuario = () => {
        reservaData.idusuario = 1; // Usuario por defecto
      };
  
      // Guardar reserva
      const guardarReserva = async () => {
        try {
          error.value = null;

          const { idusuario, idmesa, fecha, hora } = reservaData;

          // Verificar disponibilidad de la mesa
          const response = await fetch(
            `/api/reservas/verificar-disponibilidad?idmesa=${idmesa}&fecha=${fecha}&hora=${hora}&idreserva=${''}`
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
            error.value = "La mesa seleccionada ya tiene una reserva en la misma fecha y hora (o dentro de 1 hora y media).";
            return;
          }

          // Proceder a guardar la reserva
          const nuevaReserva = {
            idusuario: idusuario || 1, // Usar el usuario por defecto si no se especificó
            idmesa,
            fecha,
            hora,
            estado: 1, // Por defecto, pendiente
          };

          const responseGuardar = await axios.post('/api/reservas', nuevaReserva);
          if (responseGuardar.status === 201) {
            emit('onSave', responseGuardar.data.data);
            emit('onClose');

            // Mostrar alerta de éxito con SweetAlert2
            Swal.fire({
              title: 'Reserva exitosa!',
              text: 'Tu reserva se ha guardado correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          }

        } catch (err) {
          console.error("Error al guardar la reserva:", err);
          error.value = "Ocurrió un error al guardar la reserva.";
        }
      };
  
      const onClose = () => {
        emit('onClose');
      };
  
      return { reservaData, guardarReserva, continuarSinUsuario, error, onClose };
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
  