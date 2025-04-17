<template>
  <div class="menu-card">
    <!-- Cara frontal -->
    <div class="card-front">
      <div class="info">
        <img :src="imagen" alt="plato" class="imagen" />
      </div>
      <div class="info">
        <div>
          <h3>{{ nombre }}</h3>
          <p v-if="descuento">
            <span class="precio-original">{{ precio }} Bs.</span>
            <span class="precio-descuento">{{ precioConDescuento }} Bs.</span>
          </p>
          <p v-else>{{ precio }} Bs.</p>
          <p v-if="descuento" class="descuento">
            {{ descuento }}% de descuento
          </p>
        </div>
        <div class="cantidad">
          <input
            type="number"
            min="0"
            v-model.number="cantidadInterna"
            @input="validarCantidad"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardMenuPedido',
  props: {
    imagen: {
      type: String,
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    precio: {
      type: Number, // Cambiado a Number para cálculos
      required: true
    },
    descuento: { // Nueva prop para el descuento
      type: Number,
      default: null
    },
    id: {
      type: Number,
      required: true
    },
    cantidad: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      cantidadInterna: this.cantidad // Controla la cantidad seleccionada internamente
    };
  },
  watch: {
    cantidad(newCantidad) {
      this.cantidadInterna = newCantidad;
    }
  },
  computed: {
    precioConDescuento() {
      return this.descuento
        ? (this.precio * (1 - this.descuento / 100)).toFixed(2)
        : this.precio;
    }
  },
  methods: {
    validarCantidad() {
      if (this.cantidadInterna < 0) {
        this.cantidadInterna = 0; // Reinicia el valor si es menor a 0
      }
      this.$emit('actualizarCantidad', this.id, this.cantidadInterna);
    }
  }
};
</script>

<style scoped>
.menu-card {
  perspective: 1000px;
  width: 45%;
  height: 210px;
}

.card-front {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  box-shadow: 0 4px 8px #322209;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  background-color: #fff;
}

.imagen {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 10px;
}

.info {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.cantidad {
  display: flex;
}

.button-num {
  color: #FFFEDC;
  border: 0;
  background-color: #322209;
  padding: 2px 6px 2px 6px;
  border-radius: 100px;
  margin: 5px;
}

input {
  width: 50px;
}

/* Estilo para mostrar el precio original tachado */
.precio-original {
  text-decoration: line-through;
  color: #888;
  margin-right: 10px;
}

.precio-descuento {
  color: #E53935;
  font-weight: bold;
}

.descuento {
  color: #FE9900;
  font-size: 14px;
  font-weight: bold;
}

h3 {
  color: #322209;
}

@media (max-width: 768px) {
  .menu-card {
    width: 100%;
  }
}
</style>
