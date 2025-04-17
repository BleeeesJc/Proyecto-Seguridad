<template>
    <div class="confirmacion">
      <p>¿Seguro de que quiere eliminar {{ nombrePlatillo }}?</p>
      <div class="botones">
        <button @click="$emit('confirmarEliminacion')" class="button-delete">Eliminar</button>
        <button @click="$emit('cancelar')" class="button-cancel">Cancelar</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ConfirmacionEliminar",
    props: {
      nombrePlatillo: String
    }
  };
  </script>
  
  <style scoped>
  .confirmacion {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
    margin-top: 10px;
  }
  .botones {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 10px;
  }
  .button-delete {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  .button-cancel {
    background-color: #ccc;
    color: black;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  