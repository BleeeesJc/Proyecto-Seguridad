<template>
  <div>
    <CarouselComponent />
    <ListaProductosPedidos
      :cantidadesSeleccionadas="cantidadesSeleccionadas"
      :platillos="platillos"
      @pedidoRealizado="mostrarSuccessModal"
      @reiniciarCantidades="cantidadesSeleccionadas = {}"
    />

    <FiltroCategorias @categoriaSeleccionada="categoriaSeleccionada = $event" />

    <div class="main">
      <div class="cards">
        <CardMenuPedido
          v-for="platillo in platillosFiltrados"
          :key="platillo.idplato"
          :imagen="platillo.imagen"
          :nombre="platillo.nombre"
          :descripcion="platillo.descripcion"
          :precio="platillo.precio"
          :descuento="platillo.descuento" 
          :id="platillo.idplato"
          :cantidad="cantidadesSeleccionadas[platillo.idplato] || 0"
          @actualizarCantidad="actualizarCantidad"
        />

      </div>
    </div>
    <FooterComponent />

    <!-- Modal de éxito -->
    <SuccessModal
      v-if="successModalVisible"
      :mensaje="successMensaje"
      @onClose="closeSuccessModal"
    />

    <!-- Modal de calificación -->
    <ExpCalificacion
      :show="isModalOpen"
      @close="closeModal"
      @submitted="handleSubmitted"
    />
  </div>
</template>

<script>
import axios from "axios";
import FooterComponent from "@/components/Footer.vue";
import CarouselComponent from "@/components/CarouselComponent.vue";
import FiltroCategorias from "@/components/FiltroCategorias.vue";
import CardMenuPedido from "@/components/CardMenuPedido.vue";
import ListaProductosPedidos from "@/components/ListaProductosPedidos.vue";
import SuccessModal from "@/components/SuccessModal.vue";
import ExpCalificacion from "@/components/ExpCalificacion.vue";

export default {
  name: "MenuPedido",
  components: {
    CarouselComponent,
    CardMenuPedido,
    FiltroCategorias,
    ListaProductosPedidos,
    SuccessModal,
    ExpCalificacion,
  },
  data() {
    return {
      platillos: [],
      categoriaSeleccionada: null,
      cargando: false,
      error: null,
      cantidadesSeleccionadas: {}, // Almacena las cantidades seleccionadas por ID de platillo
      successModalVisible: false,
      successMensaje: "",
      isModalOpen: false, // Controla la visibilidad del modal de calificación
    };
  },
  computed: {
    platillosFiltrados() {
      return this.categoriaSeleccionada
        ? this.platillos.filter((p) => p.idcategoria === this.categoriaSeleccionada)
        : this.platillos;
    },
  },
  mounted() {
    this.obtenerPlatillosOfertas();
  },
  methods: {
    async obtenerPlatillosOfertas() {
      try {
        const response = await axios.get('http://localhost:5000/api/platillos/platillos-ofertas');
        this.platillos = response.data;
        await this.obtenerOfertas(); // Cargar ofertas después de los platillos

        // Relaciona ofertas con platillos
        this.platillos = this.platillos.map(platillo => {
          const oferta = this.ofertas.find(of => of.idPlato === platillo.idplato);
          if (oferta) {
            platillo.descuento = oferta.descuento; // Asegúrate de que se asigne el descuento
          } else {
            platillo.descuento = null;
          }
          return platillo;
        });
        console.log('Platillos con descuentos:', this.platillos); // Verifica los platillos
      } catch (error) {
        console.error("Error al obtener los platillos:", error);
      }
    },
    actualizarCantidad(idplato, cantidad) {
      // Actualiza la cantidad directamente
      this.cantidadesSeleccionadas = {
        ...this.cantidadesSeleccionadas,
        [idplato]: cantidad,
      };
    },
    reiniciarCantidades() {
      this.cantidadesSeleccionadas = {};
    },
    mostrarSuccessModal() {
      this.successModalVisible = true;
      this.successMensaje = "¡Pedido realizado exitosamente!";
    },
    closeSuccessModal() {
      this.successModalVisible = false;
      this.openModal(); // Abrir modal de calificación al cerrar el modal de éxito
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    handleSubmitted(rating) {
      console.log("Calificación enviada:", rating);
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.main {
max-width: 1200px;
margin: 0 auto;
margin-top: 20px;
margin-bottom: 100px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.cards > * {
  flex: 1 1 calc(33.33% - 20px); /* 33.33% para tres tarjetas por fila, menos el espacio de gap */
  max-width: calc(33.33% - 20px); /* Para asegurar que no exceda el ancho */
}

@media (max-width: 768px) {
  .cards > * {
    flex: 1 1 100%;
    max-width: 90%;
  }
}

</style>