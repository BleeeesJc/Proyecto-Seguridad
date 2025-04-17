<template>
  <div class="modal-overlay">
    <div class="modal-content success-modal">
      <div class="icon-container">
        <span class="check-icon">✔</span>
      </div>
      <p class="success-message">{{ mensaje }}</p>
      <button @click="onClose" class="accept-button">Aceptar</button>
    </div>
  </div>
</template>

<script>
export default {
name: "SuccessModal",
props: {
  mensaje: {
    type: String,
    required: true,
  },
},
emits: ["onClose"],
methods: {
  onClose() {
    this.$emit("onClose");
  },
},
};
</script>

<style scoped>
.modal-overlay {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}

.success-modal {
background: #ffab5e;
border-radius: 10px;
padding: 20px;
text-align: center;
width: 300px;
}

.icon-container {
margin-bottom: 10px;
}

.check-icon {
font-size: 50px;
color: white;
}

.success-message {
font-size: 18px;
font-weight: bold;
color: white;
margin-bottom: 20px;
}

.accept-button {
background: white;
color: #ffab5e;
border: none;
padding: 10px 20px;
font-size: 16px;
font-weight: bold;
border-radius: 5px;
cursor: pointer;
transition: 0.3s;
}

.accept-button:hover {
background: #ffc486;
}
</style>