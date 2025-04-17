<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <div class="form-container">
                <h2>Editar Oferta</h2>
                <form @submit.prevent="editarOferta" class="modern-form">
                    <div class="form-row">
                        <!-- Título -->
                        <div class="form-group">
                            <label for="titulo">
                                <i class="fas fa-heading"></i> Título
                            </label>
                            <input v-model="nuevaOferta.titulo" id="titulo" type="text"
                                placeholder="Título de la oferta" required />
                        </div>

                        <!-- Requisito -->
                        <div class="form-group">
                            <label for="requerimiento">
                                <i class="fas fa-tasks"></i> Requisito
                            </label>
                            <input v-model="nuevaOferta.requerimiento" id="requerimiento" type="text"
                                placeholder="Requisito de la oferta" required />
                        </div>
                    </div>

                    <div class="form-row">
                        <!-- Descripción -->
                        <div class="form-group">
                            <label for="descripcion">
                                <i class="fas fa-file-alt"></i> Descripción
                            </label>
                            <input v-model="nuevaOferta.descripcion" id="descripcion" type="text"
                                placeholder="Descripción de la oferta" required />
                        </div>

                        <!-- Descuento -->
                        <div class="form-group">
                            <label for="descuento">
                                <i class="fas fa-percent"></i> Descuento
                            </label>
                            <input v-model="nuevaOferta.descuento" id="descuento" type="number" min="0" max="100"
                                placeholder="Descuento (%)" required />
                        </div>
                    </div>

                    <div class="form-row">
                        <!-- Fecha Inicio -->
                        <div class="form-group">
                            <label for="fecha_inicio">
                                <i class="fas fa-calendar-alt"></i> Fecha de Inicio
                            </label>
                            <input v-model="nuevaOferta.fecha_inicio" id="fecha_inicio" type="date" required />
                        </div>

                        <!-- Fecha Fin -->
                        <div class="form-group">
                            <label for="fecha_fin">
                                <i class="fas fa-calendar-check"></i> Fecha de Expiración
                            </label>
                            <input v-model="nuevaOferta.fecha_fin" id="fecha_fin" type="date" required />
                        </div>
                    </div>

                    <div class="form-row">
                        <!-- ID Plato -->
                        <div class="form-group">
                            <div class="form-group custom-combo-box">
                                <label for="buscarPlatillo">
                                    <i class="fas fa-search"></i> Buscar Platillo
                                </label>
                                <!-- Barra de búsqueda -->
                                <input type="text" v-model="filtroPlatillo" placeholder="Buscar platillo por nombre"
                                    class="search-box" @focus="abrirComboBox" @blur="cerrarComboBox"
                                    @input="abrirComboBox" />

                                <!-- Lista desplegable -->
                                <ul v-if="comboBoxAbierto" class="combo-box-list">
                                    <li v-for="platillo in platillosFiltrados" :key="platillo.idplato"
                                        @click="seleccionarPlatillo(platillo.idplato, platillo.nombre)"
                                        class="combo-box-item">
                                        {{ platillo.nombre }}
                                    </li>
                                    <li v-if="platillosFiltrados.length === 0" class="combo-box-no-results">
                                        No se encontraron resultados
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="form-group image-upload">
                            <label for="src">Imagen</label>
                            <div class="upload-area" @drop.prevent="handleFileDrop" @dragover.prevent>
                                <div v-if="nuevaOferta.srcPreview" class="image-preview">
                                    <img :src="nuevaOferta.srcPreview" alt="Previsualización de imagen" />
                                    <button type="button" class="remove-image" @click="removeImage">✖</button>
                                </div>
                                <div v-else>
                                    <i class="fas fa-image"></i>
                                    <p>Arrastra y suelta una imagen aquí o <span>haz clic para seleccionar</span></p>
                                    <input type="file" id="src" name="imagen" @change="handleFileChange"
                                        accept="image/jpeg, image/png" />
                                </div>
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
    name: "ofertaEditComponent",
    components: {
        SuccessModal,
    },
    emits: [
        "onCancel",
    ],
    props: {
        oferta: {
            type: Object,
            required: true,
        },
    },
    watch: {
        oferta: {
            immediate: true,
            handler(newOferta) {
                if (newOferta) {
                    this.nuevaOferta = {
                        titulo: newOferta.titulo || "",
                        requerimiento: newOferta.requerimiento || "",
                        descripcion: newOferta.descripcion || "",
                        fecha_inicio: newOferta.fecha_inicio || "",
                        fecha_fin: newOferta.fecha_fin || "",
                        descuento: newOferta.descuento || 0,
                        idPlato: newOferta.idPlato || null,
                        src: null, // No hay archivo cargado inicialmente
                        srcPreview: newOferta.src ? `http://localhost:5000/${newOferta.src}` : null, // Construir URL completa
                    };
                    // Selecciona el platillo por defecto basado en el ID
                    const platillo = this.platillos.find(p => p.idplato === newOferta.idPlato);
                    if (platillo) this.filtroPlatillo = platillo.nombre;
                }
            },
        },
    },
    data() {
        return {
            mostrarModalExito: false,
            mensajeModal: "Oferta creada con exito!",
            ofertas: [],
            nuevaOferta: {
                titulo: "",
                requerimiento: "",
                descripcion: "",
                fecha_inicio: "",
                fecha_fin: "",
                descuento: 0,
                idPlato: null,
                src: null,
                srcPreview: null,
            },
            platillos: [],
            filtroPlatillo: "",
            comboBoxAbierto: false,
        };
    },
    mounted() {
        this.obtenerPlatillos();
    },
    computed: {
        platillosFiltrados() {
            return this.platillos.filter((platillo) =>
                platillo.nombre.toLowerCase().includes(this.filtroPlatillo.toLowerCase())
            );
        },
    },
    methods: {
        onCancel() {
            this.$emit("onCancel");
        },
        async obtenerPlatillos() {
            try {
                const response = await axios.get('http://localhost:5000/api/platillos');
                this.platillos = response.data;

                if (this.nuevaOferta.idplato) {
                    const platillo = this.platillos.find(p => p.idplato === this.nuevaOferta.idPlato);
                    if (platillo) this.filtroPlatillo = platillo.nombre;
                }
            } catch (error) {
                console.error("Error al obtener los platillos:", error);
            }
        },
        abrirComboBox() {
            this.comboBoxAbierto = true;
        },
        cerrarComboBox() {
            // Cierra el combo box después de un pequeño retraso para permitir seleccionar
            setTimeout(() => {
                this.comboBoxAbierto = false;
            }, 200);
        },
        seleccionarPlatillo(idPlato, nombre) {
            this.nuevaOferta.idPlato = idPlato;
            this.filtroPlatillo = nombre;
            this.comboBoxAbierto = false;
        },
        mostrarSuccessModal(mensaje) {
            this.mensajeModal = mensaje;
            this.mostrarModalExito = true;
        },
        cerrarModal() {
            this.mostrarModalExito = false; // Oculta el modal
        },
        async editarOferta() {
            try {
                if (
                    !this.nuevaOferta.titulo ||
                    !this.nuevaOferta.requerimiento ||
                    !this.nuevaOferta.descripcion ||
                    !this.nuevaOferta.fecha_inicio ||
                    !this.nuevaOferta.fecha_fin ||
                    !this.nuevaOferta.descuento ||
                    !this.nuevaOferta.idPlato
                ) {
                    alert("Por favor, completa todos los campos antes de enviar.");
                    return;
                }

                const formData = new FormData();

                for (let key in this.nuevaOferta) {
                    if (key === "src" && this.nuevaOferta.src) {
                        formData.append("imagen", this.nuevaOferta.src);
                    } else if (key !== "srcPreview") {
                        formData.append(key, this.nuevaOferta[key]);
                    }
                }

                for (let pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }


                await axios.put(`http://localhost:5000/api/ofertas/${this.oferta.idoferta}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                this.$emit("onOfertaEditada");

                this.mostrarSuccessModal("Oferta editada correctamente.");

                this.onCancel();
            } catch (error) {
                console.error("Error al editar la oferta:", error);
                alert("Ocurrió un error al editar la oferta. Por favor, inténtalo de nuevo.");
            }
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                if (file.type === "image/jpeg" || file.type === "image/png") {
                    this.nuevaOferta.src = file;
                    this.nuevaOferta.srcPreview = URL.createObjectURL(file); // Generar enlace temporal
                    console.log("Imagen cargada: ", this.nuevaOferta.srcPreview); // Debug
                } else {
                    alert("Solo se permiten archivos JPEG y PNG.");
                }
            }
        },
        handleFileDrop(event) {
            const file = event.dataTransfer.files[0];
            if (file) {
                if (file.type === "image/jpeg" || file.type === "image/png") {
                    this.nuevaOferta.src = file;
                    this.nuevaOferta.srcPreview = URL.createObjectURL(file); // Generar enlace temporal
                    console.log("Imagen cargada (drag & drop): ", this.nuevaOferta.srcPreview); // Debug
                } else {
                    alert("Solo se permiten archivos JPEG y PNG.");
                }
            }
        },

        removeImage() {
            this.nuevaOferta.src = null;
            this.nuevaOferta.srcPreview = null;
        },
    }
}
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