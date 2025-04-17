/* eslint-disable */

<template>
  <div>
    <HeaderAdminTitle 
        icon="fa fa-map-marker-alt" 
        title="Mapa de Mesas" 
        subtitle="Visualiza y gestiona la distribución de las mesas en tu restaurante"
    />

      <button v-if="rol == 2" @click="mostrarFormulario('añadir')">Añadir Mesa</button>

      <button v-if="rol == 2" @click="guardarCoordenadas()">Guardar Mesas</button>
      <svg ref="mapa" width="800" height="400"></svg>
      <div id="info-mesa">{{ infoMesa }}</div>

      <!-- Fondo semitransparente -->
      <div v-if="mostrarModal" class="overlay" @click="cerrarModal"></div>

      <!-- Modal para añadir/editar mesa -->
      <div v-if="mostrarModal" class="modal">
          <h2>{{ modoFormulario === 'añadir' ? 'Añadir Mesa' : 'Editar Mesa' }}</h2>
          <form @submit.prevent="modoFormulario === 'añadir' ? agregarMesa() : actualizarMesa()">
            <label for="nombre">Nombre:</label>
            <input type="text" v-model="mesaForm.nombre" required />

            <label for="capacidad">Capacidad:</label>
            <input type="number" v-model="mesaForm.capacidad" min="1" required />


            <button type="submit" style="grid-column: span 2;">Aceptar</button>
            <button type="button" @click="borrarMesaConfirmada" style="grid-column: span 2;">Eliminar</button>
            <button type="button" @click="cerrarModal" style="grid-column: span 2;">Cancelar</button>
            
        </form>

      </div>
      <NuevaReserva
            v-if="modalNuevaReservaVisible"
            :titulo="'Nueva Reserva'"
            :idmesa="mesaSeleccionada.idmesa"
            @onClose="cerrarModalNuevaReserva"
        />
  </div>
</template>


<script>
import * as d3 from 'd3';
import { useMesaStore } from '@/stores/mesasStore'; // Importa tu store
import NuevaReserva from "@/ventanas/reservas/reservaMapa.vue";
import Swal from 'sweetalert2';
import HeaderAdminTitle from '@/components/HeaderAdminTitle.vue';

export default {
    name: "ReservasPage",
    components: {
        NuevaReserva,
        HeaderAdminTitle,
    },
    data() {
        return {
            mesas: [],
            infoMesa: '',

            clickTimeout: null,
            mostrarModal: false,
            mostrarModalConfirmacion: false,
            modalNuevaReservaVisible: false,
            modoFormulario: '', // Puede ser 'añadir' o 'editar'
            mesaSeleccionada: {},
            actualizarMesas: [],
            mesaForm: {
                nombre: '',
                capacidad: 1,
                posx: '',
                posy: ''
            }
        };
    },
    created() {
        this.rol = parseInt(localStorage.getItem("rol"), 10); // Asegúrate de convertir a número
    },
    async mounted() {
        const mesaStore = useMesaStore(); // Usa el store de Pinia
        await mesaStore.obtenerMesas(); // Llama a la acción para obtener las mesas
        this.mesas = mesaStore.mesas; // Asigna las mesas del store al array local
        this.crearMapa();
    },
    methods: {
        cerrarModalNuevaReserva() {
        this.modalNuevaReservaVisible = false;
        },
        crearMapa() {
            const svg = d3.select(this.$refs.mapa);

            // Crear un fondo de color
            svg.append("rect")
                .attr("class", "fondo")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", "#A16F23");

                const drag = d3.drag()
                .on("start", (event, d) => {
                    // Ocultar todos los labels al comenzar a arrastrar
                    svg.selectAll(".mesa-label").remove();
                })
                .on("drag", (event, d) => {
                    d.posx = event.x;
                    d.posy = event.y;

                    svg.selectAll(".mesa")
                        .filter(m => m.idmesa === d.idmesa)
                        .attr("cx", d.posx)
                        .attr("cy", d.posy);

                    this.actualizarMesaCor(d);
                })
                .on("end", (event, d) => {
                    // Recrear los labels al terminar de arrastrar
                    svg.selectAll(".mesa-label")
                        .data(this.mesas)
                        .enter()
                        .append("text")
                        .attr("class", "mesa-label")
                        .attr("x", d => d.posx)
                        .attr("y", d => d.posy + 5)
                        .attr("text-anchor", "middle")
                        .attr("font-size", "16px")
                        .attr("font-weight", "bold")
                        .attr("fill", "#322209")
                        .text(d => d.nombre);
                });

            // Crear las mesas
            svg.selectAll(".mesa")
                .data(this.mesas)
                .enter()
                .append("circle")
                .attr("class", "mesa")
                .attr("r", 35)
                .attr("cx", d => d.posx)
                .attr("cy", d => d.posy)
                .style("fill", "#FFFEDC")
                .style("stroke", "#000")
                .style("cursor", this.rol !== 1 ? "pointer" : "pointer")
                .call(this.rol == 2 ? drag : () => {})
                .on("click", (event, d) => {
                    clearTimeout(this.clickTimeout);
                    this.clickTimeout = setTimeout(() => {
                        this.rol === 1 ? this.abrirModalNuevaReserva(d) : this.mostrarFormulario('editar', d);
                    }, 200);
                });

            // Crear las etiquetas de las mesas
            svg.selectAll(".mesa-label")
                .data(this.mesas)
                .enter()
                .append("text")
                .attr("class", "mesa-label")
                .attr("x", d => d.posx)
                .attr("y", d => d.posy + 5)
                .attr("text-anchor", "middle")
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .attr("fill", "#322209")
                .text(d => d.nombre);
                svg.append("rect")
                            .attr("x", 50)  // Posición horizontal del rectángulo
                            .attr("y", 350)  // Posición vertical del rectángulo
                            .attr("width", 100)  // Ancho del rectángulo
                            .attr("height", 40)  // Alto del rectángulo
                            .attr("fill", "#724A0E")  // Color de fondo del rectángulo
                            .attr("stroke", "#000")  // Color del borde

                        // Crear el texto "Entrada" dentro del rectángulo
                        svg.append("text")
                            .attr("x", 100)  // Centrado horizontalmente dentro del rectángulo
                            .attr("y", 375)   // Centrado verticalmente dentro del rectángulo
                            .attr("text-anchor", "middle")  // Centrado del texto
                            .attr("font-size", "16px")
                            .attr("fill", "#ffffff")  // Color del texto
                            .text("Entrada");  // El texto que aparecerá dentro del rectángulo

                            svg.append("rect")
                            .attr("x", 540)  // Posición horizontal del rectángulo
                            .attr("y", 80)  // Posición vertical del rectángulo
                            .attr("width", 2)  // Ancho del rectángulo
                            .attr("height", 250)  // Alto del rectángulo
                            .attr("fill", "#ffffff")  // Color de fondo del rectángulo
                            .attr("stroke", "#fff")  // Color del borde
        },

    // Actualiza las coordenadas de la mesa en el array 'actualizarMesas'
    actualizarMesaCor(mesa) {
        const index = this.actualizarMesas.findIndex(item => item.idmesa === mesa.idmesa);
        if (index !== -1) {
            // Si la mesa ya está en el array, actualiza las coordenadas
            this.actualizarMesas[index].posx = mesa.x;
            this.actualizarMesas[index].posy = mesa.y;
        } else {
            // Si no está, agrega la nueva mesa con sus coordenadas
            this.actualizarMesas.push({ ...mesa });
        }
    },

    // Función para guardar las mesas actualizadas en la base de datos
    guardarCoordenadas() {
        if (this.actualizarMesas.length > 0) {
            const mesaStore = useMesaStore();
            const promesas = []; // Array para guardar las promesas de las actualizaciones

            this.actualizarMesas.forEach(mesa => {
                const mesaActualizada = {
                    idmesa: mesa.idmesa,
                    posx: mesa.posx,
                    posy: mesa.posy
                };

                // Guardar las promesas de cada actualización
                promesas.push(
                    mesaStore.actualizarMesa(mesa.idmesa, mesaActualizada)
                        .then(() => {
                            console.log(`Mesa ${mesa.idmesa} actualizada correctamente.`);
                        })
                        .catch((error) => {
                            console.error('Error al guardar las coordenadas de la mesa:', error);
                        })
                );
            });

            // Esperar a que todas las actualizaciones se completen
            Promise.all(promesas)
                .then(() => {
                    mesaStore.obtenerMesas(); // Recargar las mesas desde el backend
                    this.actualizarMesas = []; // Limpiar el array después de guardar
                    Swal.fire({
                        icon: 'success',
                        title: 'Guardado exitoso',
                        text: 'Las coordenadas de las mesas se han actualizado correctamente.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                })
                .catch((error) => {
                    console.error('Error al guardar las mesas:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ocurrió un error al guardar las mesas.',
                    });
                });
        }
    },

        abrirModalNuevaReserva(mesa) {
            this.modalNuevaReservaVisible = true;
            this.mesaSeleccionada = mesa;
            // Puedes pasar información de la mesa seleccionada al modal, si es necesario
            console.log(`Abriendo modal de reserva para la mesa: ${mesa.nombre}`);
        },


        mostrarInfo(mesa) {
            this.infoMesa = `Mesa: ${mesa.nombre}, Capacidad: ${mesa.capacidad}`;
        },
       
        mostrarFormulario(modo, mesa = null) {
            this.modoFormulario = modo;
            this.mesaSeleccionada = mesa;
            if (modo === 'editar' && this.mesaSeleccionada) {
                this.mesaForm = { ...this.mesaSeleccionada };
            } else {
                this.mesaForm = { nombre: '', capacidad: 1};

            }
            this.mostrarModal = true;
            console.log('Modal visible:', this.mostrarModal); // Verifica si se cambia a true
        },
        cerrarModal() {
            this.mostrarModal = false;
            this.mostrarModalConfirmacion = false;
        },
        mostrarArray(){
                console.log("array de mesas para actualizar: ", this.actualizarMesas)
        },
        agregarMesa() {
            const nuevaMesa = { 
                nombre: this.mesaForm.nombre,
                capacidad: this.mesaForm.capacidad,
                posx: 250,  // Las posiciones x e y predeterminadas
                posy: 250
            };
            
            // Usamos el store para crear la nueva mesa
            const mesaStore = useMesaStore();
            mesaStore.crearMesa(nuevaMesa) // Llamamos al store para crear la mesa
                .then(() => {
                    this.cerrarModal();
                    this.actualizarMapa();
                })
                .catch((error) => {
                    console.error('Error al agregar la mesa:', error);
                });
        },
        actualizarMesa() {
            const mesaActualizada = {
                nombre: this.mesaForm.nombre,
                capacidad: this.mesaForm.capacidad,
                posx: this.mesaForm.posx,
                posy: this.mesaForm.posy
            };

            const mesaStore = useMesaStore();

            mesaStore.actualizarMesa(this.mesaSeleccionada.idmesa, mesaActualizada)
                .then(() => {
                    this.cerrarModal(); // Cierra el modal de edición
                    this.actualizarMapa(); // Actualiza el mapa
                    mesaStore.obtenerMesas(); // Recarga las mesas desde el backend
                    Swal.fire({
                        icon: 'success',
                        title: 'Actualización exitosa',
                        text: `La mesa "${mesaActualizada.nombre}" se ha actualizado correctamente.`,
                        timer: 2000,
                        showConfirmButton: false
                    });
                })
                .catch((error) => {
                    console.error('Error al actualizar la mesa:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ocurrió un error al actualizar la mesa.',
                    });
                });
        },


        mostrarModalBorrar() {
            if (this.mesaSeleccionada) {
                this.mostrarModalConfirmacion = true;
            }
        },
        borrarMesaConfirmada() {
            // Verificar si hay una mesa seleccionada
            if (this.mesaSeleccionada && this.mesaSeleccionada.idmesa) {
                // Mostrar el cuadro de confirmación con SweetAlert
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Esta acción no se puede deshacer. Se eliminará la mesa seleccionada.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Usamos el store para borrar la mesa
                        const mesaStore = useMesaStore();
                        mesaStore.borrarMesa(this.mesaSeleccionada.idmesa) // Llamamos al store para eliminar la mesa
                            .then(() => {
                                Swal.fire(
                                    '¡Eliminada!',
                                    'La mesa ha sido eliminada con éxito.',
                                    'success'
                                );
                                this.cerrarModal();  // Cierra el modal después de eliminar
                                this.actualizarMapa();  // Vuelve a actualizar el mapa
                                mesaStore.obtenerMesas(); // Recarga los datos
                            })
                            .catch((error) => {
                                console.error('Error al borrar la mesa desde el store:', error);
                                Swal.fire(
                                    'Error',
                                    'Ocurrió un error al intentar eliminar la mesa.',
                                    'error'
                                );
                            });
                    }
                });
            } else {
                Swal.fire(
                    'No hay mesa seleccionada',
                    'Por favor, selecciona una mesa para eliminar.',
                    'info'
                );
                console.error("No hay mesa seleccionada para eliminar.");
            }
        },

        actualizarMapa() {
            d3.select(this.$refs.mapa).selectAll(".mesa").remove();
            this.crearMapa();
        }
    }
};
</script>


<style scoped>
.mesa {
    transition: fill 0.2s;
}
.mesa.active {
    stroke: #f00;
    stroke-width: 2px;
}
.modal {
    display: block;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    height: auto; /* Ajusta la altura para que sea más corta */
    max-height: 400px; /* Establece una altura máxima */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    overflow-y: auto; /* Permite desplazarse si hay contenido extra */
}

.modal form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.modal form label {
    grid-column: span 2; /* Hace que las etiquetas ocupen ambas columnas */
}

.modal form input {
    grid-column: span 2; /* Hace que los campos de entrada ocupen ambas columnas */
}

.modal form button {
    grid-column: span 1;
}


/* Fondo semitransparente detrás del modal */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Fondo negro semitransparente */
    z-index: 999;
}
@import url("https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&subset=devanagari,latin-ext");

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  background-color: #343a40;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  user-select: none;
}

.card {
  border-radius: 10px;
  filter: drop-shadow(0 5px 10px 0 #ffffff);
  width: 400px;
  height: 180px;
  background-color: #ffffff;
  padding: 20px;
  position: relative;
  z-index: 0;
  overflow: hidden;
  transition: 0.6s ease-in;
}

.card::before {
  content: "";
  position: absolute;
  z-index: -1;
  top: -15px;
  right: -15px;
  background: #f3b976;
  height:220px;
  width: 25px;
  border-radius: 32px;
  transform: scale(1);
  transform-origin: 50% 50%;
  transition: transform 0.25s ease-out;
}

.card:hover::before{
    transition-delay:0.2s ;

  transform: scale(40);
}

.card:hover{
    color: #ffffff;

}

.card p{
    padding: 10px 0;
}


button {
    margin: 5px;
}
</style>
