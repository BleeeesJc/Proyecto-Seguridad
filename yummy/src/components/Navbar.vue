<template>
  <nav class="nav-container">
    <div class="navIzquierda">
      <!-- Logo -->
      <img src="@/assets/images/logoprincipal.jpeg" alt="Imagen del logo" class="logo" style="width: 120px;" @click="goToHome">
      <h1>Tu lugar para compartir y disfrutar</h1>

      <div class="opciones">
        <!-- Ofertas -->
        <a v-if="isLoggedIn && permisos.ofertacliente">
          <router-link to="/ofertas">Ofertas</router-link>
        </a>

        <!-- Realizar Pedido -->
        <a v-if="isLoggedIn && permisos.pedidocliente">
          <router-link to="/menupedido">Realizar Pedido</router-link>
        </a>

        <!-- Mapa Interactivo -->
        <a v-if="isLoggedIn && permisos.mapacliente">
          <router-link to="/mapa">Mapa Interactivo</router-link>
        </a>

        <!-- Menú -->
        <a v-if="isLoggedIn && permisos.menucliente">
          <router-link to="/menu">Menú</router-link>
        </a>

<!-- Panel Administrativo (solo si tiene permisos correctos) -->
<a v-if="isLoggedIn && puedeVerPanelAdmin">
  <router-link to="/panelAdministrativo">Panel</router-link>
</a>

        <!-- Dropdown de opciones -->
        <div v-if="isLoggedIn && isAdmin !== 1" class="dropdown" @mouseleave="closeDropdown">
          <button class="dropdown-btn" @click="toggleDropdown">Opciones</button>
          <div v-if="dropdownVisible" class="dropdown-content">
            <router-link to="/mispedidos">Mis Pedidos</router-link>
            <router-link to="/misreservas">Mis Reservas</router-link>
            <router-link to="/miscalificaciones">Mis Calificaciones</router-link>
            <a @click="handleAuthAction">Cerrar Sesión</a>
          </div>
        </div>

        <!-- Cerrar sesión directo (si no es rol 1) -->
        <span v-if="isLoggedIn && isAdmin !== 1" @click="handleAuthAction" class="logout-admin">Cerrar Sesión</span>

        <!-- Login (solo si no está logueado) -->
        <a v-if="!isLoggedIn" @click="goToLogin">Login</a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarComponent",
  data() {
    return {
      isLoggedIn: false,
      permisos: {},
      dropdownVisible: false,
    };
  },
  computed: {
    puedeVerPanelAdmin() {
      return (
        this.permisos.asignacionroles ||
        this.permisos.dashboard ||
        this.permisos.ofertas ||
        this.permisos.usuarios ||
        this.permisos.platillos ||
        this.permisos.pedidos ||
        this.permisos.reservas ||
        this.permisos.mapainteractivo
      );
    }
  },
  mounted() {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    this.isLoggedIn = !!token && !!usuario;
    this.permisos = usuario?.rol || {}; 
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    closeDropdown() {
      this.dropdownVisible = false;
    },
    goToHome() {
      this.$router.push('/');
    },
    goToLogin() {
      this.$router.push('/iniciarsesion');
    },
    handleAuthAction() {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('rol');
      localStorage.removeItem('usuario');
      this.isLoggedIn = false;
      this.$router.push('/');
    },
  },
};
</script>



<style scoped>
/* Estilos */
html,
body {
  margin: 0;
  padding: 0;
}

.opciones {
  text-align: end;
}

.opciones a {
  padding-right: 3%;
  text-decoration: none;
  color: white;
}

.opciones a:hover {
  text-decoration: underline;
  color: black;
}

.navIzquierda h1 {
  color: aliceblue;
  font-size: 2vh;
  display: block;
  text-align: center;
  padding-right: 5%;
  padding-left: 5%;
}

.nav-container {
  background-color: #FE9900;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  top: 0;
  width: 100%;
}

.logo {
  width: 40px;
  margin-left: 0%;
  margin-right: 0;
  text-align: center;
}

/* Estilos del Dropdown */
.dropdown {
  position: relative;
  display: inline-block;
  margin-right: 10vh;
}

.dropdown-btn {
  background-color: #FE9900;
  color: white;
  padding: 2vh;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Asegurar que el contenido del dropdown no desaparezca */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;
}


.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

/* Estilo de "Cerrar Sesión" para Admin */
.logout-admin {
  cursor: pointer;
  color: white;
  text-decoration: underline;
  padding-right: 3%;
}

.logout-admin:hover {
  color: black;
}
</style>
