<template>
  <nav class="nav-container">
    <div class="navIzquierda">
      <!-- Logo -->
      <img src="@/assets/images/logoprincipal.jpeg" alt="Imagen del logo" class="logo" style="width: 120px;" @click="goToHome">
      <h1>Tu lugar para compartir y disfrutar</h1>
      
      <div class="opciones">
        <a><router-link to="/ofertas">Ofertas</router-link></a>
        
        <a v-if="(isLoggedIn && isAdmin === 2) || (isLoggedIn && isAdmin === 3) ">
          <router-link to="/menumesero">Realizar Pedido</router-link>
        </a>
        <a v-else><router-link to="/menupedido">Realizar Pedido</router-link></a>

        <a v-if="isLoggedIn && isAdmin != 2"><router-link to="/mapa">Mapa Interactivo</router-link></a>
        <a><router-link to="/menu">Menu</router-link></a>
        <a v-if="isLoggedIn && isAdmin === 2">
          <router-link to="/panelAdministrativo">Panel Administrativo</router-link>
        </a>

        <!-- Botón Opciones -->
        <div v-if="isLoggedIn && isAdmin !== 2" class="dropdown" @mouseleave="closeDropdown">
          <button class="dropdown-btn" @click="toggleDropdown">Opciones</button>
          <div v-if="dropdownVisible" class="dropdown-content">
            <router-link to="/mispedidos">Mis Pedidos</router-link>
            <router-link to="/misreservas">Mis Reservas</router-link>
            <router-link to="/miscalificaciones">Mis Calificaciones</router-link>
            <a @click="handleAuthAction">Cerrar Sesión</a>
          </div>
        </div>


        <!-- Solo Cerrar Sesión para Administrador -->
        <span v-if="isLoggedIn && isAdmin === 2" @click="handleAuthAction" class="logout-admin">Cerrar Sesión</span>

        <!-- Login para usuarios no logueados -->
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
      isLoggedIn: false, // Estado de autenticación
      isAdmin: '', // Rol del usuario
      dropdownVisible: false,
    };
  },
  mounted() {
    // Verifica si hay un token al cargar el componente
    this.isLoggedIn = !!localStorage.getItem('token');
    this.isAdmin = parseInt(localStorage.getItem("rol"), 10);
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
      if (this.isLoggedIn) {
        // Si el usuario está logueado, cerrar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('rol'); // Elimina el token del almacenamiento local
        this.isLoggedIn = false;
        this.$router.push('/'); // Redirige al Home después de cerrar sesión
      }
    },
  },
};
</script>

<style scoped>
/* Estilos */
html, body {
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
