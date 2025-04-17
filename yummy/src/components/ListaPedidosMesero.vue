<template>
    <div>
      <button class="floating-button" @click="toggleModal">
        <i class="fas fa-utensils"></i>
      </button>
      <transition name="fade">
        <div v-if="isModalOpen" class="modal-overlay" @click.self="toggleModal">
          <div class="modal-content">
            <button class="close-icon" @click="toggleModal">
              <i class="fa-solid fa-x"></i>
            </button>
            <h2>Pedido Cliente</h2>
            <div class="id-usuario">
                <label for="idUsuario">ID Usuario:</label>
                <input type="text" id="idUsuario" v-model="pedidoData.idusuario" placeholder="Ingrese ID del usuario" />
            </div>
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Platillo</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="platillo in platillosSeleccionados" :key="platillo.idplato">
                    <td>{{ platillo.nombre }}</td>
                    <td>
                      {{ platillo.descuento ? `${platillo.precioConDescuento} Bs. (Oferta)` : `${platillo.precio} Bs.` }}
                    </td>
                    <td>{{ platillo.cantidad }}</td>
                    <td>{{ platillo.subtotal }} Bs.</td>
                  </tr>
                </tbody>
              </table>
              <h2><strong>Total: {{ total }} Bs. </strong></h2>
            </div>
            <button class="order-button" @click="realizarPedido">Realizar pedido</button>
          </div>
        </div>
      </transition>
    </div>
    <SuccessModal v-if="successModalVisible" :mensaje="successMensaje" @onClose="closeSuccessModal" />
</template>

<script>
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import SuccessModal from "./SuccessModal.vue";

export default {
  name: "ListaPedidosMesero",
  components: {
    SuccessModal,
  },
  props: {
    cantidadesSeleccionadas: {
      type: Object,
      required: true,
    },
    platillos: {
      type: Array,
      required: true,
    },
  },
  computed: {
    platillosSeleccionados() {
      return this.platillos
        .filter((p) => this.cantidadesSeleccionadas[p.idplato] > 0)
        .map((p) => {
          const precioConDescuento = p.descuento
            ? p.precio - (p.precio * p.descuento) / 100
            : p.precio;
          return {
            ...p,
            precioConDescuento: precioConDescuento.toFixed(2),
            cantidad: this.cantidadesSeleccionadas[p.idplato],
            subtotal: (this.cantidadesSeleccionadas[p.idplato] * precioConDescuento).toFixed(2),
          };
        });
    },
    total() {
      return this.platillosSeleccionados.reduce((sum, p) => sum + parseFloat(p.subtotal), 0).toFixed(2);
    },
  },
  data() {
    return {
      isModalOpen: false,
      successModalVisible: false,
      successMensaje: "",
      pedidoData: {
        idusuario: "", // Modelo para el ID del usuario ingresado por el mesero
      },
    };
  },
  methods: {
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
    },
    async realizarPedido() {
      if (this.platillosSeleccionados.length === 0) {
        alert("Debe seleccionar productos primero");
        return;
      }

      if (!this.pedidoData.idusuario) {
        alert("Debe ingresar el ID del usuario antes de realizar un pedido.");
        return;
      }

      const pedido = {
        fecha: new Date().toISOString().slice(0, 10),
        hora: new Date().toTimeString().slice(0, 8),
        estado: 0,
        idusuario: parseInt(this.pedidoData.idusuario, 10),
        precio_total: this.total,
        detalles: this.platillosSeleccionados.map((p) => ({
          idplato: p.idplato,
          cantidad: p.cantidad,
        })),
      };

      try {
        const response = await axios.post("http://localhost:5000/api/pedidos", pedido);

        await axios.post("http://localhost:5000/api/usuario/confirmar-pedido", {
          idUsuario: response.data.idusuario,
          detalles: response.data.detalles,
          precio_total: response.data.precio_total,
        });

        //this.mostrarSuccessModal("Pedido realizado con éxito. Revisa tu correo electrónico.");
        this.$emit("pedidoRealizado");
        this.toggleModal();
        //this.generarPDF(); // Llamada a la función para generar el PDF
      } catch (error) {
        console.error("Error al realizar el pedido:", error);
        alert("Hubo un error al realizar el pedido. Por favor, inténtelo nuevamente.");
      }
    },
    mostrarSuccessModal(mensaje) {
      this.successMensaje = mensaje;
      this.successModalVisible = true;
    },
    closeSuccessModal() {
      this.successModalVisible = false;
    },
    generarPDF() {
      const doc = new jsPDF();

      // Título
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("DETALLE DEL PEDIDO", 10, 20);

      // Fecha y Hora
      const fecha = new Date().toISOString().slice(0, 10);
      const hora = new Date().toTimeString().slice(0, 8);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha: ${fecha}`, 10, 30);
      doc.text(`Hora: ${hora}`, 10, 36);

      // Tabla de productos
      const productos = this.platillosSeleccionados.map((platillo) => [
        platillo.nombre,
        platillo.descuento
          ? `${platillo.precioConDescuento} Bs. (Oferta)`
          : `${platillo.precio} Bs.`,
        platillo.cantidad,
        `${platillo.subtotal} Bs.`,
      ]);

      doc.autoTable({
        startY: 50,
        head: [["Platillo", "Precio", "Cantidad", "Subtotal"]],
        body: productos,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 12,
          halign: "center",
        },
        headStyles: {
          fillColor: [255, 223, 102],
          textColor: [50, 34, 9],
        },
        bodyStyles: {
          textColor: [50, 34, 9],
        },
      });

      // Total
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Total: ${this.total} Bs.`, 10, finalY);

      // Descargar el PDF
      doc.save("pedido.pdf");
    },
  },
};
</script>

<style scoped>
.floating-button {
position: fixed;
top: 50px;
right: 0px;
background-color: #322209;
color: white;
border: none;
border-radius: 50% 0 0 50%;
width: 70px;
height: 70px;
display: flex;
align-items: center;
justify-content: center;
font-size: 24px;
cursor: pointer;
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
z-index: 1000;
}

.modal-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.6);
display: flex;
align-items: center;
justify-content: center;
z-index: 999;
}

.modal-content {
width: 70%;
background-color: #FFFEDC;
border-radius: 8px;
box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
overflow: hidden;
padding: 20px;
}

.table-container {
overflow-x: auto;
width: 100%;
}

.table {
width: 100%;
border-collapse: collapse;
margin: 20px 0;
font-size: 16px;
text-align: left;
}

.table th,
.table td {
border: 1px solid #ddd;
padding: 12px;
}

.table th {
background-color: #FFFDA4;
color: #322209;
text-align: center;
}

.table tbody tr:nth-child(even) {
background-color: #f9f9f9;
}

.table tbody tr:hover {
background-color: #f1f1f1;
}

.table tfoot tr td {
background-color: #FFFDA4;
font-weight: bold;
text-align: center;
}

h2 {
color: #322209;

}

.order-button {
background-color: #322209;
color: #FFFEDC;
border: none;
padding: 10px;
width: 40%;
margin-top: 20px;
cursor: pointer;
font-size: 16px;
border-radius: 50px;
align-self: center;
}

.order-button:hover {
background-color: #807f7f;
}

.close-icon {
position: absolute;
top: 10px;
right: 10px;
background: none;
border: none;
background-color: #322209;
color: #FFFEDC;
font-size: 24px;
cursor: pointer;
z-index: 1001;
border-radius: 50px;
padding: 5px;
padding-left: 15px;
padding-right: 15px;
}

.close-icon:hover {
color: #807f7f;
}

.id-usuario {
  display: flex;
  align-items: center; /* Alinea verticalmente al centro */
  gap: 10px; /* Espaciado entre el label y el input */
}

</style>
  