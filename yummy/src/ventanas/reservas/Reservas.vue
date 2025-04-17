<template>
  <HeaderAdminTitle 
    icon="fa fa-calendar-check" 
    title="Reservas" 
    subtitle="Gestiona las reservas realizadas por tus clientes"
  />
  <div class="reservas-container">
    <button @click="abrirModalNuevaReserva" class="nuevo-button">Nueva Reserva</button>
        <!-- Modal de nueva reserva -->
        <NuevaReserva
            v-if="modalNuevaReservaVisible"
            :titulo="'Nueva Reserva'"
            @onClose="cerrarModalNuevaReserva"
            @onSave="guardarNuevaReserva"
        />


    <!-- Filtros -->
    <div class="filtros">
      <div class="filtro-fecha">
        <label>Desde:</label>
        <div class="input-group">
          <input type="date" v-model="filtroFechaDesde" />
          <button @click="limpiarFiltro('filtroFechaDesde')" class="limpiar-boton">✖</button>
        </div>
      </div>
      <div class="filtro-fecha">
        <label>Hasta:</label>
        <div class="input-group">
          <input type="date" v-model="filtroFechaHasta" />
          <button @click="limpiarFiltro('filtroFechaHasta')" class="limpiar-boton">✖</button>
        </div>
      </div>
      <div class="filtro-hora">
        <label>Desde:</label>
        <div class="input-group">
          <input type="time" v-model="filtroHoraDesde" />
          <button @click="limpiarFiltro('filtroHoraDesde')" class="limpiar-boton">✖</button>
        </div>
      </div>
      <div class="filtro-hora">
        <label>Hasta:</label>
        <div class="input-group">
          <input type="time" v-model="filtroHoraHasta" />
          <button @click="limpiarFiltro('filtroHoraHasta')" class="limpiar-boton">✖</button>
        </div>
      </div>
    </div>

    <!-- Reservas -->
    <div class="reservas-grid">
      <ReservaCard
        v-for="reserva in reservasFiltradas"
        :key="reserva.idreserva"
        :mesa="reserva.nombremesa"
        :fecha="reserva.fecha"
        :hora="reserva.hora"
        :nombre="reserva.nombre"
        :estado="String(reserva.estado)"
        @click="editarReserva(reserva)"
        @cambiarEstado="actualizarEstadoReserva(reserva, $event)"
      />

      <!-- Modal para editar reservas -->
      <ModalEditReserva
        v-if="modalVisible"
        :titulo="'Editar Reserva'"
        :reserva="reservaSeleccionada"
        @onClose="modalVisible = false"
        @onSave="guardarReservaEditada"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ReservaCard from "@/components/ReservaCard.vue";
import ModalEditReserva from "@/ventanas/reservas/editarReserva.vue";
import NuevaReserva from "@/ventanas/reservas/newReserva.vue";
import HeaderAdminTitle from "@/components/HeaderAdminTitle.vue";

export default {
  name: "ReservasView",
  components: {
    ReservaCard,
    ModalEditReserva,
    NuevaReserva,
    HeaderAdminTitle,
  },
  data() {
    return {
      reservas: [],
      mesas: [],
      modalVisible: false,
      reservaSeleccionada: null,
      filtroFechaDesde: "",
      filtroFechaHasta: "",
      filtroHoraDesde: "",
      filtroHoraHasta: "",

      //para anadir reserva
      modalNuevaReservaVisible: false,
    };
  },
  computed: {
    reservasFiltradas() {
      return this.reservas.filter((reserva) => {

        const cumpleFechaDesde =
          !this.filtroFechaDesde || reserva.fecha >= this.filtroFechaDesde;
        const cumpleFechaHasta =
          !this.filtroFechaHasta || reserva.fecha <= this.filtroFechaHasta;

        const cumpleHoraDesde =
          !this.filtroHoraDesde || reserva.hora >= this.filtroHoraDesde;
        const cumpleHoraHasta =
          !this.filtroHoraHasta || reserva.hora <= this.filtroHoraHasta;

        return cumpleFechaDesde && cumpleFechaHasta && cumpleHoraDesde && cumpleHoraHasta;
      });
    },
  },
  methods: {
    abrirModalNuevaReserva() {
      this.modalNuevaReservaVisible = true;
    },
    cerrarModalNuevaReserva() {
      this.modalNuevaReservaVisible = false;
    },

    async cargarReservas() {
      try {
        const reservasResponse = await axios.get("/api/reservas");
        this.reservas = reservasResponse.data;

        // Solo combinar datos si las mesas ya han sido cargadas
        if (this.mesas.length > 0) {
          this.asociarReservasConMesas();
        }

        console.log("Reservas cargadas: ", this.reservas);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      }
    },

    async cargarMesas() {
      try {
        const mesasResponse = await axios.get("/api/mesas");
        this.mesas = mesasResponse.data;

       
        if (this.reservas.length > 0) {
          this.asociarReservasConMesas();
        }

        console.log("Mesas cargadas:", this.mesas);
      } catch (error) {
        console.error("Error al cargar mesas:", error);
      }
    },

    asociarReservasConMesas() {
      // Añadir el campo nombremesa a las reservas
      this.reservas = this.reservas.map((reserva) => {
        const mesa = this.mesas.find((m) => m.idmesa === reserva.idmesa);
        return {
          ...reserva,
          nombremesa: mesa ? mesa.nombre : "Mesa desconocida",
        };
      });

      console.log("Reservas con nombres de mesa: ", this.reservas);
    },

    limpiarFiltro(campo) {
      this[campo] = ""; // Limpia el filtro especificado
    },
    editarReserva(reserva) {
      this.reservaSeleccionada = { ...reserva };
      this.modalVisible = true;
    },
    async guardarReservaEditada(nuevaReserva) {
      try {
        const estadoInt = parseInt(nuevaReserva.estado);
        const idUsuario = nuevaReserva.idusuario;
        const idMesa = nuevaReserva.idmesa;

        await axios.put(`/api/reservas/${nuevaReserva.idreserva}`, {
          ...nuevaReserva,
          estado: estadoInt,
          idUsuario,
          idMesa,
        });

        const index = this.reservas.findIndex(
          (r) => r.idreserva === nuevaReserva.idreserva
        );
        if (index !== -1) {
          this.reservas.splice(index, 1, { ...nuevaReserva, estado: estadoInt });
        }
        this.modalVisible = false;
      } catch (error) {
        console.error("Error al guardar la reserva editada:", error);
      }
    },
    async actualizarEstadoReserva(reserva, nuevoEstado) {
      try {
        const estadoInt = parseInt(nuevoEstado);
        await axios.put(`/api/reservas/${reserva.idreserva}`, {
          idreserva: reserva.idreserva,
          idusuario: reserva.idusuario,
          idmesa: reserva.idmesa,
          fecha: reserva.fecha,
          hora: reserva.hora,
          estado: estadoInt,
        });

        reserva.estado = estadoInt;
      } catch (error) {
        console.error("Error al actualizar el estado de la reserva:", error);
      }
    },

    //anadir reserva
    async guardarNuevaReserva(nuevaReserva) {
      try {
    
        const response = await axios.post("/api/reservas", nuevaReserva);

        // Agregar la nueva reserva a la lista localmente
        this.reservas.push(response.data);


        this.asociarReservasConMesas();


        this.cerrarModalNuevaReserva();
      } catch (error) {
        console.error("Error al guardar la nueva reserva:", error);
        alert("Ocurrió un error al guardar la nueva reserva.");
      }
    },
  },
  mounted() {
    this.cargarReservas();
    this.cargarMesas();
  },
};
</script>


<style scoped>
/* Estilo de la sección de filtros */
.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0 auto;
  padding: 0;
  margin-bottom: 2rem;
  margin-top: 2rem;

}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  border-color: #F5F3F3;
  border-radius: 2vh;
}

.limpiar-boton {
  background: #ffab5e;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.limpiar-boton:hover {
  background: #a16f23;
}

.reservas-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  margin: 0 auto;
  padding: 0;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

}

.titulo {
  display: block;
  padding-top: 1vh;
  font-size: 2.5rem;
  font-weight: bold;
  color: #a16f23;
  margin-bottom: 1rem;
  text-align: left;
}
.reservas-container {
  padding: 5%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Reorganización responsiva */
@media (max-width: 768px) {
  .filtros {
    grid-template-columns: repeat(2, 1fr); /* 2 columnas en pantallas pequeñas */
  }
}

@media (max-width: 480px) {
  .filtros {
    grid-template-columns: 1fr; /* Una sola columna en pantallas muy pequeñas */
    gap: 1rem; /* Aumentar espaciado vertical */
  }

  .filtro-fecha,
  .filtro-hora {
    flex-direction: row; /* Coloca el label y el input en una fila */
    align-items: center;
    justify-content: space-between;
  }

  .input-group {
    width: 100%; /* Ocupa todo el ancho disponible */
  }

  input {
    flex: 1; /* Deja que el input ocupe el espacio restante */
  }
}
</style>
