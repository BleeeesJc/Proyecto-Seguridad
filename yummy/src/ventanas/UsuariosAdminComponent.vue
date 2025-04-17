<template>
    <div>
        <header class="offers-header">
            <h2>
                <i class="fas fa-tags"></i>
                Usuarios
            </h2>
            <p>Administra y cambia el rol de tus usuarios</p>
        </header>

        <!-- Barra de búsqueda -->
        <div class="search-container">
            <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input type="text" v-model="searchQuery" placeholder="Buscar por nombre o apellidos..."
                    class="search-input">
            </div>
        </div>

        <div class="table-container">
            <table class="offers-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="usuario in filteredUsuarios" :key="usuario.idusuario">
                        <td>{{ usuario.idusuario }}</td>
                        <td>{{ usuario.nombre }}</td>
                        <td>{{ usuario.apellidos }}</td>
                        <td>{{ usuario.correo }}</td>
                        <td>
                            <select v-if="usuario.isEditing" v-model="usuario.selectedRolIndex">
                                <option v-for="(rol, index) in roles" :key="rol.idrol" :value="index">
                                    {{ rol.rol }}
                                </option>
                            </select>
                            <span v-else>{{ obtenerNombreRol(usuario.idrol) }}</span>
                        </td>
                        <td>
                            <button class="action-button edit-button" @click="toggleEdit(usuario)">
                                <i class="fas" :class="usuario.isEditing ? 'fa-check' : 'fa-edit'"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "UsuariosAdminComponent",
    data() {
        return {
            usuarios: [],
            roles: [],
            searchQuery: '',
        };
    },
    mounted() {
        this.obtenerUsuarios();
        this.obtenerRoles();
    },
    computed: {
        filteredUsuarios() {
            const query = this.removeDiacritics(this.searchQuery.toLowerCase()).trim();
            if (!query) return this.usuarios;
            const terms = query.split(/\s+/).filter(term => term.length > 0);
            return this.usuarios.filter(usuario => {
                const fullName = this.removeDiacritics(
                    `${usuario.nombre || ''} ${usuario.apellidos || ''}`
                ).toLowerCase();
                return terms.every(term => fullName.includes(term));
            });
        }
    },
    methods: {
        removeDiacritics(str) {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        },
        async obtenerUsuarios() {
            try {
                const response = await axios.get('http://localhost:5000/api/usuario');
                this.usuarios = response.data.map(usuario => ({
                    ...usuario,
                    isEditing: false,
                    selectedRolIndex: null,
                }));
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
            }
        },
        async obtenerRoles() {
            try {
                const response = await axios.get('http://localhost:5000/api/rol');
                this.roles = response.data;
            } catch (error) {
                console.error("Error al obtener los roles:", error);
            }
        },
        obtenerNombreRol(idrol) {
            const rol = this.roles.find(r => r.idrol === idrol);
            return rol ? rol.rol : 'Desconocido';
        },
        toggleEdit(usuario) {
            if (usuario.isEditing) {
                this.actualizarRol(usuario);
            } else {
                usuario.isEditing = true;
                const index = this.roles.findIndex(r => r.idrol === usuario.idrol);
                usuario.selectedRolIndex = index;
            }
        },
        async actualizarRol(usuario) {
            try {
                const selectedIndex = usuario.selectedRolIndex;
                const nuevoRol = this.roles[selectedIndex].idrol;
                console.log("Rol seleccionado: ", nuevoRol);

                const response = await axios.put(`http://localhost:5000/api/usuario/${usuario.idusuario}/rol`, {
                    idRol: nuevoRol,
                });
                console.log('Rol actualizado correctamente', response);

                usuario.idrol = nuevoRol;
                usuario.isEditing = false;
            } catch (error) {
                console.error('Error al actualizar el rol:', error);
            }
        },
    },
}
</script>

<style scoped>
.offers-header {
    text-align: center;
    background: linear-gradient(180deg, #ff9900, #ffcc00);
    color: white;
    padding: 20px 10px;
    border-radius: 0 0 15px 15px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
}

.offers-header h2 {
    font-size: 2.5em;
    font-weight: bold;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.offers-header h2 i {
    font-size: 0.8em;
    color: #ffd700;
    animation: bounce 1s infinite;
}

.offers-header p {
    font-size: 1.2em;
    margin-top: 10px;
    color: #fff8e7;
    font-style: italic;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

/* Barra de búsqueda */
.search-container {
    display: flex;
    justify-content: center;
    margin: 20px;
}

.search-box {
    position: relative;
    width: 50%;
    max-width: 500px;
}

.search-icon {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #888;
    font-size: 1.2em;
}

.search-input {
    width: 100%;
    padding: 10px 10px 10px 40px;
    font-size: 1em;
    border-radius: 25px;
    border: 1px solid #ccc;
    background: linear-gradient(45deg, #fff, #f9f9f9);
    transition: all 0.3s ease;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
    outline: none;
    border-color: #ff9900;
    background: linear-gradient(45deg, #fff, #ffe6b3);
    box-shadow: 0 0 5px #ff9900;
}

.search-input::placeholder {
    color: #aaa;
    font-style: italic;
}

/* Contenedor de la tabla */
.table-container {
    margin: 20px;
    box-shadow: 0 0 40px -14px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    overflow: hidden;
    /* Altura dinámica: ajusta 200px según el espacio ocupado por header y search */
    height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
}

/* La tabla se desplaza dentro si es más grande de lo que cabe */
.offers-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
    flex: 1 1 auto;
    overflow: auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 0.95em;
    justify-content: center;
}

/* Encabezado fijo */
.offers-table thead th {
    position: sticky;
    top: 0;
    background-color: #fafafa;
    color: #333;
    font-weight: bold;
    padding: 12px;
    border-bottom: 2px solid #ddd;
    text-align: left;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Estilos para las celdas */
.offers-table td {
    border-bottom: 1px solid #eee;
    padding: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

/* Alternar colores de fila */
.offers-table tbody tr:nth-child(odd) {
    background: #fff;
}

.offers-table tbody tr:nth-child(even) {
    background: #f9f9f9;
}

/* Hover en las filas */
.offers-table tbody tr:hover {
    background: #f1f1f1;
}

/* Botón de edición */
.action-button.edit-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #4caf50;
    font-size: 1.2em;
    padding: 5px;
    transition: transform 0.2s;
}

.action-button.edit-button:hover {
    transform: scale(1.1);
}

/* Estilo del select al editar */
.offers-table select {
    padding: 5px;
    font-size: 1em;
    width: 100%;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
}
</style>