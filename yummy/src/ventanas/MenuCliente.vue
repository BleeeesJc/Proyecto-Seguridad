<template>
  <div>
    <CarouselComponent />
    
    <!-- Escucha el evento y almacena el ID de la categoría seleccionada -->
    <FiltroCategorias @categoriaSeleccionada="categoriaSeleccionada = $event" />

    <div class="main">
      <div class="cards">
        <!-- Filtra y muestra los platillos según la categoría seleccionada -->
        <CardMenu
          v-for="(platillo, index) in platillosFiltrados"
          :key="index"
          :imagen="platillo.imagen"
          :nombre="platillo.nombre"
          :descripcion="platillo.descripcion"
          :precio="platillo.precio"
          :descuento="platillo.descuento" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CardMenu from '@/components/CardMenu.vue';
import FiltroCategorias from '@/components/FiltroCategorias.vue';
import CarouselComponent from '@/components/CarouselComponent.vue';

export default {
  name: 'MenuCliente',
  components: {
    CarouselComponent,
    CardMenu,
    FiltroCategorias,
  },
  data() {
    return {
      platillos: [],
      ofertas: [],
      categoriaSeleccionada: null,
      cargando: false,
      error: null
    };
  },
  computed: {
    // Filtra los platillos según la categoría seleccionada
    platillosFiltrados() {
      return this.categoriaSeleccionada
        ? this.platillos.filter(p => p.idcategoria === this.categoriaSeleccionada)
        : this.platillos;
    }
  },
  mounted() {
    //this.obtenerPlatillos();
    this.obtenerPlatillosOfertas();
  },
  methods: {
    async obtenerPlatillosOfertas() {
      try {
        const response = await axios.get('http://localhost:5000/api/platillos/platillos-ofertas');
        this.platillos = response.data;
        await this.obtenerOfertas(); // Cargar ofertas después de los platillos NO BORRAR

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
    
  }
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
  flex: 1 1 calc(33.33% - 20px); /* Tres tarjetas por fila */
  max-width: calc(33.33% - 20px);
}

@media (max-width: 768px) {
  .cards > * {
    flex: 1 1 100%;
    max-width: 90%;
  }
}
</style>
