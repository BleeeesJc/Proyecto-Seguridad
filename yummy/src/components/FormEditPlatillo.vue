<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="form-container">
        <h2>Editar Platillo</h2>
        <form @submit.prevent="editarPlatillo" class="modern-form">
            <div class="form-row">
                <!-- Nombre -->
                <div class="form-group">
                <label for="nombre">
                    <i class="fas fa-utensils"></i> Nombre
                </label>
                <input v-model="nuevoPlatillo.nombre" id="nombre" type="text" placeholder="Nombre del platillo" required />
                </div>

                <!-- Precio -->
                <div class="form-group">
                <label for="precio">
                    <i class="fas fa-dollar-sign"></i> Precio (Bs)
                </label>
                <input v-model="nuevoPlatillo.precio" id="precio" type="number" min="1" placeholder="Precio" required />
                </div>
            </div>
            
            <div class="form-row">
                <!-- Descripción -->
                <div class="form-group">
                <label for="descripcion">
                    <i class="fas fa-file-alt"></i> Descripción
                </label>
                <input v-model="nuevoPlatillo.descripcion" id="descripcion" type="text" placeholder="Descripción del platillo"
                    required />
                </div>

                <!-- Categoría -->
                <div class="form-group custom-combo-box">
                    <label for="buscarCategoria">
                        <i class="fas fa-list"></i> Categoría
                    </label>
                    <input type="text" v-model="filtroCategoria" placeholder="Buscar categoría" class="search-box"
                        @focus="abrirComboBox" @blur="cerrarComboBox" @input="abrirComboBox" />

                    <ul v-if="comboBoxAbierto" class="combo-box-list">
                        <li v-for="categoria in categoriasFiltradas" :key="categoria.idcategoria"
                        @click="seleccionarCategoria(categoria.idcategoria, categoria.tipo)" class="combo-box-item">
                        {{ categoria.tipo }}
                        </li>
                        <li v-if="categoriasFiltradas.length === 0" class="combo-box-no-results">
                        No se encontraron resultados
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Subida de imagen -->
            <div class="form-group image-upload">
                <label for="imagen">Imagen</label>
                <div class="upload-area" @drop.prevent="handleFileDrop" @dragover.prevent>
                <div v-if="nuevoPlatillo.srcPreview" class="image-preview">
                    <img :src="nuevoPlatillo.srcPreview" alt="Previsualización de imagen" />
                    <button type="button" class="remove-image" @click="removeImage">✖</button>
                </div>
                <div v-else>
                    <i class="fas fa-image"></i>
                    <p>Arrastra y suelta una imagen aquí o <span>haz clic para seleccionar</span></p>
                    <input type="file" id="imagen" @change="handleFileChange" accept="image/jpeg, image/png" />
                </div>
                </div>
            </div>

            <div class="btns-container">
                <button type="submit" class="submit-button">Confirmar Edicion</button>
                <button type="button" @click="onCancel" class="cancel-button">Cancelar Edicion</button>
            </div>
        </form>
      </div>
    </div>
  </div>
  <SuccessModal v-if="successModalVisible" :mensaje="successMensaje" @onClose="closeSuccessModal" />
</template>

<script>
import axios from 'axios';
import SuccessModal from './SuccessModal.vue';

export default {
  name: "FormEditPlatillo",
  components: { 
    SuccessModal,
  },
  emits: [
    "onCancel",
  ],
  props: {
    platillo: {
        type: Object,
        required: true,
    },
  },
    watch: {
    platillo: {
        immediate: true,
        handler(nuevoPlatillo) {
          console.log("Platillo recibido:", nuevoPlatillo);
          this.nuevoPlatillo = { ...nuevoPlatillo, imagen: null, srcPreview: null };
        },
    },
  },
  data() {
    return {
      nuevoPlatillo: {
        nombre: "",
        descripcion: "",
        precio: "",
        idCategoria: null,
        imagen: null,
        srcPreview: null,
      },
      categorias: [],
      filtroCategoria: "",
      comboBoxAbierto: false,
      successModalVisible: false,
      successMensaje: '',
    };
  },
  mounted() {
    this.obtenerCategorias();
  },
  computed: {
    categoriasFiltradas() {
      return this.categorias.filter((categoria) =>
        categoria.tipo.toLowerCase().includes(this.filtroCategoria.toLowerCase())
      );
    },
  },
  methods: {
    onCancel() {
      this.$emit("onCancel");
    },
    async obtenerCategorias() {
      try {
        const response = await axios.get('http://localhost:5000/api/categorias');
        this.categorias = response.data;
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    },
    abrirComboBox() {
      this.comboBoxAbierto = true;
    },
    cerrarComboBox() {
      setTimeout(() => {
        this.comboBoxAbierto = false;
      }, 200);
    },
    seleccionarCategoria(idCategoria, tipo) {
      this.nuevoPlatillo.idCategoria = idCategoria;
      this.filtroCategoria = tipo;
      this.comboBoxAbierto = false;
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        this.nuevoPlatillo.imagen = file;
        this.nuevoPlatillo.srcPreview = URL.createObjectURL(file);
      } else {
        alert("Solo se permiten archivos JPEG y PNG.");
      }
    },
    handleFileDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file) {
        if (file.type === "image/jpeg" || file.type === "image/png") {
            this.nuevoPlatillo.imagen = file;
            this.nuevoPlatillo.srcPreview = URL.createObjectURL(file); // Generar enlace temporal
            console.log("Imagen cargada (drag & drop): ", this.nuevaOferta.srcPreview); // Debug
        } else {
            alert("Solo se permiten archivos JPEG y PNG.");
        }
      }
    },
    async editarPlatillo() {
        if (!this.nuevoPlatillo.nombre || !this.nuevoPlatillo.precio || !this.nuevoPlatillo.descripcion || !this.nuevoPlatillo.idCategoria) {
            alert("Completa todos los campos.");
            return;
        }

        const formData = new FormData();

        
        formData.append("nombre", this.nuevoPlatillo.nombre);
        formData.append("descripcion", this.nuevoPlatillo.descripcion);
        formData.append("precio", this.nuevoPlatillo.precio);
        formData.append("idCategoria", this.nuevoPlatillo.idCategoria);

        if (this.nuevoPlatillo.imagen) {
            formData.append("imagen", this.nuevoPlatillo.imagen);
        }
        

        try {
            console.log(formData);
            const response = await axios.put(`http://localhost:5000/api/platillos/${this.nuevoPlatillo.idplato}`, formData);

            // Notifica al padre que el platillo fue editado
            this.$emit("onPlatilloEditada");

            // Muestra un mensaje de éxito
            this.mostrarSuccessModal("Platillo editado correctamente");
        } catch (error) {
            console.error("Error al editar el platillo:", error);
            alert("Ocurrió un error al editar el platillo.");
        }
    },
    removeImage() {
      this.nuevoPlatillo.imagen = null;
      this.nuevoPlatillo.srcPreview = null;
    },
    mostrarSuccessModal(mensaje) {
      this.successMensaje = mensaje;
      this.successModalVisible = true;
    },
    closeSuccessModal() {
      this.successModalVisible = false;
    },
  },
};
</script>

<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    align-items: center;
}

.btns-container {
    display: flex;
    gap: 1em;
    justify-content: space-evenly;
}

.cancel-button {
    background-color: #fe9900;
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    align-self: flex-start;
    /* Alinea el botón a la izquierda */
}

.cancel-button:hover {
    background-color: #e08b00;
}
</style>