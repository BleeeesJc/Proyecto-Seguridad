<template>
  <div class="form-container">
    <h2>Agregar Platillo</h2>
    <form @submit.prevent="crearPlatillo" class="modern-form">
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

      <button type="submit" class="submit-button">Crear Platillo</button>
    </form>
  </div>
  <SuccessModal
    v-if="successModalVisible"
    :mensaje="successMensaje"
    @onClose="closeSuccessModal"
  />
</template>

<script>
import axios from 'axios';
import SuccessModal from './SuccessModal.vue';

export default {
  name: "FormNewPlatillo",
  components: { 
    SuccessModal,
  },
  data() {
    return {
      nuevoPlatillo: {
        nombre: "",
        descripcion: "",
        precio: "",
        idCategoria: null,
        src: null,
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
    async crearPlatillo() {
      if (!this.nuevoPlatillo.nombre || !this.nuevoPlatillo.precio || !this.nuevoPlatillo.descripcion || !this.nuevoPlatillo.idCategoria || !this.nuevoPlatillo.src) {
        alert("Completa todos los campos.");
        return;
      }

      const formData = new FormData();
      for (let key in this.nuevoPlatillo) {
        if (key === "src") {
          formData.append("imagen", this.nuevoPlatillo.src);
        } else {
          formData.append(key, this.nuevoPlatillo[key]);
        }
      }

      try {
        await axios.post("http://localhost:5000/api/platillos", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        this.mostrarSuccessModal('Platillo creado correctamente');
        this.resetForm();
      } catch (error) {
        console.error("Error al crear el platillo:", error);
        alert("Error al crear el platillo");
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        this.nuevoPlatillo.src = file;
        this.nuevoPlatillo.srcPreview = URL.createObjectURL(file);
      } else {
        alert("Solo se permiten archivos JPEG y PNG.");
      }
    },
    removeImage() {
      this.nuevoPlatillo.src = null;
      this.nuevoPlatillo.srcPreview = null;
    },
    resetForm() {
      this.nuevoPlatillo = {
        nombre: "",
        descripcion: "",
        precio: "",
        idCategoria: null,
        src: null,
        srcPreview: null,
      };
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


<style scooped>
.form-container {
  max-width: 90%;
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.modern-form {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  /* Espacio entre columnas */
}

.form-group {
  flex: 1;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input[type="text"],
input[type="date"],
input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #fe9900;
}

.image-upload .upload-area {
  border: 2px dashed #ddd;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.image-upload .upload-area:hover {
  border-color: #fe9900;
}

.image-upload .upload-area i {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #888;
}

.image-upload .upload-area p {
  margin: 0;
  font-size: 1rem;
  color: #555;
}

.image-upload .upload-area span {
  color: #fe9900;
  font-weight: bold;
  cursor: pointer;
}

.image-preview {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 300px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.remove-image:hover {
  background-color: #d32f2f;
}

.submit-button {
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

.submit-button:hover {
  background-color: #e08b00;
}

.custom-combo-box {
  position: relative;
}

.search-box {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.combo-box-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 1000;
  list-style: none;
  margin: 5px 0 0;
  padding: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.combo-box-item {
  padding: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.combo-box-item:hover {
  background: #f2f2f2;
}

.combo-box-no-results {
  padding: 10px;
  color: #888;
  font-style: italic;
}
</style>