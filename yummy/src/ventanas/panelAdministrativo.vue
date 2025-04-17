/* eslint-disable */
<template>
    <div id="app" class="dashboard">
        <Sidebar />
        <div class="main-content">
            <router-view />
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/SidebarComponent.vue';

export default {
    name: "PanelAdministrativo",
    components: {
        Sidebar,
    },
};
</script>

<style>
.dashboard {
    display: flex;
    height: 100vh;
    padding-bottom: 0;
}

.main-content {
    flex-grow: 1;
    background-color: #f8f9fa;
    overflow-y: auto;
    /* Permite desplazamiento vertical si el contenido excede */
}
</style>