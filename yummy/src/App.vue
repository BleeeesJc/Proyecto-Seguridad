<template>
  <NavbarComponent />
  <router-view />
  <FooterComponent />
</template>

<script>
import NavbarComponent from '@/components/Navbar.vue';
import FooterComponent from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    NavbarComponent,
    FooterComponent,
  },
};
</script>

<style>
body, #app {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Ocultar scroll horizontal */
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
