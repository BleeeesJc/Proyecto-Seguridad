/* eslint-disable */

<template>
  <div class="contenedorP">
      <h1>Mapa Interactivo de Mesas</h1>
      <!-- Filtros -->
      <div class="filtros">
        <div class="filtro-fecha">
            <label>Día:</label>
            <div class="input-group">
            <input type="date" v-model="filtroDia" />
            <button @click="limpiarFiltro('filtroDia')" class="limpiar-boton">✖</button>
            </div>
        </div>
        <div class="filtro-hora">
            <label>Hora:</label>
            <div class="input-group">
            <input type="time" v-model="filtroHora" />
            <button @click="limpiarFiltro('filtroHora')" class="limpiar-boton">✖</button>
            </div>
        </div>
        <button @click="aplicarFiltros" class="btn-aplicar">Aplicar Filtros</button>
        </div>


      <div v-if="mostrarMesa" class="row">
        <div class="card">
            <h4>{{mesaSeleccionada.nombre}}</h4>
            <p>Capacidad: {{ mesaSeleccionada.capacidad }}</p>
            <button class="btn-reservar" @click="abrirModalReserva">Reservar</button>
        </div>
    </div>
      <button v-if="rol == 2" @click="mostrarFormulario('añadir')">Añadir Mesa</button>
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

            <label for="capacidad">PosX:</label>
            <input type="number" v-model="mesaForm.posx" />

            <label for="capacidad">PosY:</label>
            <input type="number" v-model="mesaForm.posy"/>

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

export default {
    name: "ReservasPage",
    components: {
        NuevaReserva
    },
    data() {
        return {
        mesas: [],
        reservas: [],
        reservasFiltradasTemp: [],
        filtroDia: "",
        filtroHora: "",
        infoMesa: "",
        mostrarMesa: false,
        clickTimeout: null,
        mostrarModal: false,
        mostrarModalConfirmacion: false,
        modalNuevaReservaVisible: false,
        modoFormulario: "", // Puede ser 'añadir' o 'editar'
        mesaSeleccionada: {},
        mesaForm: {
            nombre: "",
            capacidad: 1,
            posx: "",
            posy: "",
        },
        };
    },
    created() {
        this.rol = parseInt(localStorage.getItem("rol"), 10); // Asegúrate de convertir a número
    },
    watch: {
    filtroDia(newValue) {
        console.log("Nuevo filtro de día:", newValue);
    },
    filtroHora(newValue) {
        console.log("Nuevo filtro de hora:", newValue);
    },
},
    async mounted() {
        const mesaStore = useMesaStore(); // Usa el store de Pinia
        await mesaStore.obtenerMesas();
        await mesaStore.obtenerReservas(); // Llama a la acción para obtener las mesas
        this.mesas = mesaStore.mesas;
        this.reservas = mesaStore.reservas; // Asigna las mesas del store al array local
        this.crearMapa();
    },
    
    methods: {
        aplicarFiltros() {
            if (!this.filtroDia || !this.filtroHora) {
            console.log("Filtros no aplicados: día o hora están vacíos.");
            this.reservasFiltradasTemp = [];
            return;
            }

            const fechaSeleccionada = new Date(this.filtroDia);
            const horaSeleccionada = new Date(`1970-01-01T${this.filtroHora}:00`);

            if (isNaN(fechaSeleccionada) || isNaN(horaSeleccionada)) {
            console.log("Error al interpretar los filtros como fechas u horas.");
            this.reservasFiltradasTemp = [];
            return;
            }

            this.reservasFiltradasTemp = this.reservas.filter((reserva) => {
            const fechaReserva = new Date(reserva.fecha);
            const horaReserva = new Date(`1970-01-01T${reserva.hora}`);

            const mismaFecha = fechaReserva.toDateString() === fechaSeleccionada.toDateString();
            const diferenciaMinutos = Math.abs(horaReserva - horaSeleccionada) / (1000 * 60);
            const intervaloHora = diferenciaMinutos <= 60;

            return mismaFecha && intervaloHora;
            });

            console.log("Reservas filtradas manualmente:", this.reservasFiltradasTemp);
            this.actualizarColoresMesas();
        },
        actualizarColoresMesas() {
            const svg = d3.select(this.$refs.mapa);

            svg.selectAll(".mesa").style("fill", (d) => {
            const reservaFiltrada = this.reservasFiltradasTemp.find((r) => r.idmesa === d.idmesa);
            return reservaFiltrada ? "#724A0E" : "#FFFEDC";
            });
        },
        cerrarModalNuevaReserva() {
        this.modalNuevaReservaVisible = false;
        },
        limpiarFiltro(campo) {
            this[campo] = "";
            console.log(`Filtro ${campo} limpiado, valor actual:`, this[campo]);
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
                .on("start", function (event, d) {
                    d3.select(this).raise().classed("active", true);
                })
                .on("drag", function (event, d) {
                    d.x = event.x;
                    d.y = event.y;
                    d3.select(this).attr("cx", d.x).attr("cy", d.y);
                    d3.select(this.parentNode).select(".mesa-label")
                        .attr("x", d.x)
                        .attr("y", d.y + 5);
                })
                .on("end", function () {
                    d3.select(this).classed("active", false);
                });

            // Obtener la hora actual
            const ahora = new Date();

                        // Crear los círculos para las mesas
            svg.selectAll(".mesa")
                .data(this.mesas)
                .enter()
                .append("circle")
                .attr("class", "mesa")
                .attr("r", 35)
                .attr("cx", d => d.posx)
                .attr("cy", d => d.posy)
                .style("fill", (d) => {
                    const reservaFiltrada = this.reservasFiltradasTemp.find((r) => r.idmesa === d.idmesa);
                    return reservaFiltrada ? "#724A0E" : "#FFFEDC";
                })
                .style("stroke", "#000")
                .style("cursor", (d) => {
                    const reservaFiltrada = this.reservasFiltradasTemp.find((r) => r.idmesa === d.idmesa);
                    return reservaFiltrada ? "not-allowed" : "pointer";
                })
                .call(this.rol == 2 ? drag : () => {})
                .on("click", (event, d) => {
                // Verificar si la mesa está reservada
                const reservaFiltrada = this.reservasFiltradasTemp.find((r) => r.idmesa === d.idmesa);
                if (reservaFiltrada) {
                    // Mesa reservada, no permitir clic
                    return;
                }

                clearTimeout(this.clickTimeout);
                this.clickTimeout = setTimeout(() => {
                    // Cambiar el color de la mesa (círculo)
                    svg.selectAll(".mesa")
                        .filter(m => m.idmesa === d.idmesa)
                        .style("fill", "#322209");  // Usa .style("fill") en lugar de .attr("fill")

                    // Cambiar el color del texto
                    svg.selectAll(".mesa-label")
                        .filter(m => m.idmesa === d.idmesa)
                        .attr("fill", "white");

                    // Proceder según el rol del usuario
                    this.rol === 1 ? this.abrirModalNuevaReserva(d) : this.mostrarFormulario('editar', d);
                }, 200);
            });

            // Crear las etiquetas (nombres) de las mesas
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


            // Crear otros elementos del mapa
            svg.append("rect")
                .attr("x", 50)
                .attr("y", 350)
                .attr("width", 100)
                .attr("height", 40)
                .attr("fill", "#724A0E")
                .attr("stroke", "#000");

            svg.append("text")
                .attr("x", 100)
                .attr("y", 375)
                .attr("text-anchor", "middle")
                .attr("font-size", "16px")
                .attr("fill", "#ffffff")
                .text("Entrada");

            svg.append("rect")
                .attr("x", 540)
                .attr("y", 80)
                .attr("width", 2)
                .attr("height", 250)
                .attr("fill", "#ffffff")
                .attr("stroke", "#fff");
        },


        abrirModalNuevaReserva(mesa) {
            this.mostrarMesa = true;
            this.mesaSeleccionada = mesa;
            // Puedes pasar información de la mesa seleccionada al modal, si es necesario
            console.log(`Abriendo modal de reserva para la mesa: ${mesa.nombre}`);
        },
        abrirModalReserva() {
            this.modalNuevaReservaVisible = true;

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
                posx: this.mesaForm.posx,  // Asegúrate de mantener las posiciones
                posy: this.mesaForm.posy
            };

            // Usamos el store para actualizar la mesa
            const mesaStore = useMesaStore();
            mesaStore.actualizarMesa(this.mesaSeleccionada.idmesa, mesaActualizada) // Llamamos al store para actualizar la mesa
                .then(() => {
                    this.cerrarModal();
                    this.actualizarMapa();
                    // Vuelve a obtener las mesas actualizadas desde el backend
                    mesaStore.obtenerMesas(); // Recarga los datos
                })
                .catch((error) => {
                    console.error('Error al actualizar la mesa:', error);
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
                // Confirmar eliminación
                const confirmar = confirm("¿Estás seguro de que deseas eliminar esta mesa?");
                if (confirmar) {
                    // Usamos el store para borrar la mesa
                    const mesaStore = useMesaStore();
                    mesaStore.borrarMesa(this.mesaSeleccionada.idmesa) // Llamamos al store para eliminar la mesa
                        .then(() => {
                            this.cerrarModal();  // Cierra el modal después de eliminar
                            this.actualizarMapa();  // Vuelve a actualizar el mapa
                            mesaStore.obtenerMesas(); // Recarga los datos
                        })
                        .catch((error) => {
                            console.error('Error al borrar la mesa desde el store:', error);
                        });
                }
            } else {
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
/* Estilo de la sección de filtros */
.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0 auto;
  padding: 0;
  margin-bottom: 2rem;
  margin-left: 40%;
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
.row {
    display: flex; /* Activa el uso de flexbox */
    justify-content: center; /* Centra horizontalmente */
    align-items: center; /* Centra verticalmente */
    height: 30dvh;
    background-color: #f5f5f5; /* Fondo opcional */
}

.contenedorP{
    margin-bottom: 50px;
}
.btn-aplicar {
    background-color: #f3b976;  /* Color de fondo */
    color: white;               /* Color del texto */
    height: 50px;
    margin-top: 20px;
    font-size: 16px;            /* Tamaño de la fuente */
    padding: 10px 20px;         /* Espaciado interior (arriba/abajo, izquierda/derecha) */
    border: none;               /* Eliminar borde */
    border-radius: 5px;         /* Bordes redondeados */
    cursor: pointer;            /* Cursor tipo mano */
    transition: background-color 0.3s ease, transform 0.3s ease; /* Efecto suave */
}

.btn-aplicar:hover {
    background-color: #a07545;  /* Cambiar color de fondo cuando el cursor está sobre el botón */
    transform: scale(1.05);      /* Efecto de escala al pasar el ratón */
}

.btn-aplicar:active {
    background-color: #a07545;  /* Cambiar color de fondo cuando se hace clic */
    transform: scale(1);        /* Vuelve al tamaño original */
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
.btn-reservar {
    background-color: #c0992e; /* Color verde */
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

/* Efecto hover */
.btn-reservar:hover {
    background-color: #a07545; /* Verde más oscuro */
    transform: scale(1.05); /* Aumenta ligeramente el tamaño */
}

/* Efecto de clic */
.btn-reservar:active {
    transform: scale(0.95); /* Reduce el tamaño ligeramente */
}

.card p{
    padding: 10px 0;
}


button {
    margin: 5px;
}
</style>
