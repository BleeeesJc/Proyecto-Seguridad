<template>
  <div class="filtro-categorias">
    <!-- Opción de 'Todos' siempre disponible y activa al inicio -->
    <button
      @click="seleccionarCategoria(null)"
      :class="{ activo: categoriaSeleccionada === null }"
    >
      Todos
    </button>
    
    <!-- Itera sobre cada categoría obtenida y muestra el tipo -->
    <button
      v-for="(categoria, index) in categorias"
      :key="index"
      @click="seleccionarCategoria(categoria.idcategoria)"
      :class="{ activo: categoriaSeleccionada === categoria.idcategoria }"
    >
      {{ categoria.tipo }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FiltroCategorias',
  data() {
    return {
      categorias: [], // Almacena las categorías obtenidas
      categoriaSeleccionada: null, // Marca "Todos" como activo al inicio
    };
  },
  mounted() {
    this.obtenerCategorias();
  },
  methods: {
    async obtenerCategorias() {
      try {
        const response = await axios.get('http://localhost:5000/api/categorias');
        this.categorias = response.data;
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    },
    seleccionarCategoria(idCategoria) {
      this.categoriaSeleccionada = idCategoria; // Actualiza la categoría seleccionada
      this.$emit('categoriaSeleccionada', idCategoria);
    },
  },
};
</script>

<style scoped>
.filtro-categorias {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
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
