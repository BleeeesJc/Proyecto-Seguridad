<template>
  <div>
    <button class="floating-button" @click="toggleModal">
      <i class="fas fa-edit"></i>
    </button>
    <transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="toggleModal">
        <div class="modal-content">
          <div class="side-menu">
            <h2>Administración</h2>
            <ul>
              <li :class="{ active: selectedSection === 'ofertas' }" @click="selectedSection = 'ofertas'">
                <i class="fas fa-tag"></i> Ofertas
              </li>
              <li :class="{ active: selectedSection === 'usuarios' }" @click="selectedSection = 'usuarios'">
                <i class="fas fa-users"></i> Usuarios
              </li>
              <li :class="{ active: selectedSection === 'platillos' }" @click="selectedSection = 'platillos'">
                <i class="fas fa-utensils"></i> Platillos
              </li>
              <li :class="{ active: selectedSection === 'reservas' }" @click="selectedSection = 'reservas'">
                <i class="fas fa-calendar-check"></i> Reservas
              </li>
            </ul>
          </div>

          <!-- Contenido principal del modal -->
          <div class="main-content">
            <component :is="currentComponent"></component>
            <button class="close-button" @click="toggleModal">Cerrar</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import OfertasComponent from '@/components/OfertasAdminComponent.vue';
import UsuariosComponent from '@/components/UsuariosAdminComponent.vue';
import PlatillosComponent from '@/components/PlatillosAdminComponent.vue';
import ReservasComponent from '@/components/ReservasAdminComponent.vue';

export default {
  name: "AdminPanelComponent",
  data() {
    return {
      isModalOpen: false,
      selectedSection: "ofertas",
    };
  },
  computed: {
    currentComponent() {
      const componentes = {
        ofertas: OfertasComponent,
        usuarios: UsuariosComponent,
        platillos: PlatillosComponent,
        reservas: ReservasComponent,
      };
      return componentes[this.selectedSection];
    },
  },
  methods: {
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
    },
  },
};
</script>

<style scoped>
.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
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
  display: flex; 
  flex-direction: row;
  width: 100%;
  max-width: 1000px;
  height: 50%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.side-menu {
  width: 250px;
  height: 100%; 
  background-color: #333;
  color: white;
  padding: 20px;
  box-sizing: border-box;
}

.side-menu h2 {
  margin-top: 0;
  color: #ff8c00;
}

.side-menu ul {
  list-style: none;
  padding: 0;
}

.side-menu li {
  margin: 15px ;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.side-menu li.active {
  font-weight: bold;
  color: #ff8c00;
}

.side-menu i {
  padding-right: 5%;
}

.main-content {
  flex: 1; 
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.main-content h2 {
  margin-top: 0;
  color: #333;
}

.close-button {
  background-color: #ccc;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  margin-top: 20px;
  cursor: pointer;
  font-size: 16px;
}

.close-button:hover{
  background-color: #807f7f;
}

/* Animación para mostrar el modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
