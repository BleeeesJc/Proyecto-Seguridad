/* eslint-disable */
<template>
    <div class="sidebar">
      <h2 class="logo">Yummy</h2>
      <div class="opciones">
        <a
          v-for="(ruta, index) in rutasConPermiso"
          :key="index"
        >
          <router-link
            :to="ruta.to"
            class="sidebar-link"
            active-class="active-link"
          >
            {{ ruta.label }}
          </router-link>
        </a>
      </div>
    </div>
  </template>
  
<script>
export default {
  name: "SidebarComponent",
  data() {
    return {
      selectedSection: 'DashboardComponent',
      permisos: {},
      rutasVisibles: [
        { to: "/panelAdministrativo/rol", label: "Rol", permiso: "asignacionroles" },
        { to: "/panelAdministrativo/section1", label: "Dashboard", permiso: "dashboard" },
        { to: "/panelAdministrativo/ofertas", label: "Ofertas", permiso: "ofertas" },
        { to: "/panelAdministrativo/usuarios", label: "Usuarios", permiso: "usuarios" },
        { to: "/panelAdministrativo/platillos", label: "Platillos", permiso: "platillos" },
        { to: "/panelAdministrativo/pedidosadmin", label: "Pedidos", permiso: "pedidos" },
        { to: "/panelAdministrativo/reservas", label: "Reservas", permiso: "reservas" },
        { to: "/panelAdministrativo/mapa", label: "Mapa Interactivo", permiso: "mapainteractivo" }
      ]
    };
  },
  computed: {
    rutasConPermiso() {
      return this.rutasVisibles.filter(ruta => this.permisos[ruta.permiso]);
    }
  },
  created() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    this.permisos = usuario?.rol || {};
  },
  methods: {
    navigate(section) {
      this.selectedSection = section;
      this.$emit('navigate', section);
    }
  }
};
</script>


<style scoped>
.sidebar {
    width: 250px;
    min-width: 250px;
    max-width: 250px;
    background: linear-gradient(180deg, #ff9900, #ffcc00);
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    /* Evita que el contenido sobresalga */
    animation: slideInFromLeft 1s ease-out;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeIn 1s ease-in forwards;
    /* Aparece con un desvanecimiento */
    animation-delay: 0.3s;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    padding: 10px 0;
    cursor: pointer;
    transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;
    opacity: 0;
    animation: fadeIn 1s ease-in forwards;
    /* Cada elemento aparece con retraso */
}

li:hover {
    background: #A16F23;
    transform: translateX(5px);
    /* Mueve ligeramente hacia la derecha */
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}

.opciones {
    display: flex;
    flex-direction: column;
    gap: 5px;
    /* Espacio entre enlaces sin desplazar horizontalmente */
}

.sidebar-link {
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px 20px;
    color: white;
    text-decoration: none;
    font-size: 1rem;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    white-space: nowrap;
    /* Evita saltos de línea */
    overflow: hidden;
    /* Por si el texto es largo */
    text-overflow: ellipsis;
    /* Añade "..." si se excede el ancho */
}

.sidebar-link:hover {
    background-color: #a16f23;
    /* Eliminamos translateX para evitar ensanchamiento */
    /* Puedes agregar otra animación, por ejemplo, color o shadow interno */
    box-shadow: inset 2px 0 0 white;
    /* Indicador sutil sin modificar ancho total */
}

.active-link {
    background-color: #a16f23;
    font-weight: bold;
    box-shadow: inset 4px 0 0 white;
    /* Indicador interno sin alterar el ancho */
}

.active-link::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 0 6px 6px;
    border-color: transparent transparent transparent white;
    /* Este triángulo se dibuja dentro del ancho fixed, no lo supera */
}

li.active {
    background-color: #A16F23;
    /* Color para la opción seleccionada */
    font-weight: bold;
    /* Resalta el texto */
    border-left: 4px solid white;
    /* Indicador visual adicional */
    transform: translateX(0);
    /* Evita el movimiento al pasar el mouse */
}

li:nth-child(1) {
    animation-delay: 0.5s;
}

li:nth-child(2) {
    animation-delay: 0.7s;
}

li:nth-child(3) {
    animation-delay: 0.9s;
}

li:nth-child(4) {
    animation-delay: 1.1s;
}

/* Keyframes para animaciones */
@keyframes slideInFromLeft {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
