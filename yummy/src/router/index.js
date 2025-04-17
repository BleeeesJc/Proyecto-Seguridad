import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/ventanas/home.vue';
import RegistroUsuario from '@/ventanas/registro.vue';
import LogIn from '@/ventanas/login.vue';
import Reservas from '@/ventanas/reservas/Reservas.vue';
import PanelAdministrativo from '@/ventanas/panelAdministrativo.vue';
import Recupera from '@/ventanas/recupera.vue';
import CambioPass from '@/ventanas/cambioPassword.vue';
import Ofertas from '@/ventanas/ofertasPage.vue';
import MenuPedido from '@/ventanas/MenuPedido.vue';
import PedidosAdmin from '@/components/PedidosAdminComponent.vue';
import MapaInteractivo1 from '@/ventanas/mapaInteractivo.vue';
import MenuCliente from '@/ventanas/MenuCliente.vue'
import TemporalCalificacion from '@/ventanas/temporalCalificacion.vue'
import MisReservas from '@/ventanas/reservas/MisReservas.vue';
import MisPedidos from '@/ventanas/MisPedidos.vue';
import MisCalificaciones from '@/ventanas/MisCalificaciones.vue';
import MenuPedidoMesero from '@/ventanas/MenuPedidoMesero.vue';

//para el administrador
import MapaInteractivo2 from '@/ventanas/mapaAdmin.vue';
import OfertasAdminComponent from '../ventanas/OfertasAdminComponent.vue'
import PlatillosAdminComponent from '@/components/PlatillosAdminComponent.vue';
import JReservasAdminComponent from '@/ventanas/reservas/Reservas.vue';
import UsuariosAdminComponent from '../ventanas/UsuariosAdminComponent.vue';
import DashboardComponent from '../ventanas/dashboardComponent.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/ofertas',
      name: 'Ofertas',
      component: Ofertas,
    },
    {
      path: '/iniciarsesion',
      name: 'LogIn',
      component: LogIn,
    },
    {
      path: '/registro',
      name: 'RegistroUsuario',
      component: RegistroUsuario,
    },
    {
      path: '/reservas',
      name: 'Reservas',
      component: Reservas,
    },
    {
      path: '/ofertas',
      name: 'Ofertas',
      component: Ofertas,
    },
    {
      path: '/menu',
      name: 'Menu',
      component: MenuCliente,
    },
    {
      path: '/recupera',
      name: 'Recupera',
      component: Recupera,
    },
    {
      path: '/cambioPass/:id',
      name: 'CambioPassword',
      component: CambioPass,
    },
    {
      path: '/mapa',
      name: 'MapaUsuario',
      component: MapaInteractivo1,
    },
    {
      path: '/menucliente',
      name: 'MenuCliente',
      component: MenuCliente,
    },
    {
      path: '/menupedido',
      name: 'MenuPedido',
      component: MenuPedido,
    },
    {
      path: '/temporal',
      name: 'Calificaciones',
      component: TemporalCalificacion,
    },
    {
      path: '/misreservas',
      name: 'MisReservas',
      component: MisReservas,
    },
    {
      path: '/mispedidos',
      name: 'MisPedidos',
      component: MisPedidos,
    },
    {
      path: '/miscalificaciones',
      name: 'MisCalificaciones',
      component: MisCalificaciones,
    },
    {
      path: '/menumesero',
      name: 'MenuMesero',
      component: MenuPedidoMesero,
    },
    //Para el Panel Administrativo
    {
      path: '/panelAdministrativo',
      name: 'PanelAdministrativo',
      component: PanelAdministrativo,
      //meta: { requiresAuth: true }, // Requiere autenticación
      children: [
        {
          path: 'section1',
          name: 'Dashboard',
          component: DashboardComponent,
        },
        {
          path: 'ofertas',
          name: 'AdminOfertas',
          component: OfertasAdminComponent,
        },

        {
          path: 'usuarios',
          name: 'AdminUsuarios',
          component: UsuariosAdminComponent, // Gestión de ofertas
        },

        {
          path: 'platillos',
          name: 'AdminPlatillos',
          component: PlatillosAdminComponent,
        },
        {
          path: 'reservas',
          name: 'AdminReservas',
          component: JReservasAdminComponent,
        },
        {
          path: 'mapa',
          name: 'MapaAdmin',
          component: MapaInteractivo2,
        },
        {
          path: 'pedidosadmin',
          name: 'PedidosAdmin',
          component: PedidosAdmin,
        },
      ],
    },
  ],
});


router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      next({ name: 'LogIn' });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
