<template>
  <div class="modal-overlay">
    <div class="modal-content confirmation-modal">
      <p class="confirmation-message">{{ mensaje }}</p>
      <div class="button-container">
        <button @click="onCancel" class="cancel-button">Cancelar</button>
        <button @click="onConfirm" class="confirm-button">Continuar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmationModal",
  props: {
    mensaje: {
      type: String,
      required: true,
    },
  },
  emits: ["onCancel", "onConfirm"],
  methods: {
    onCancel() {
      this.$emit("onCancel");
    },
    onConfirm() {
      this.$emit("onConfirm");
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

.confirmation-modal {
  background: #fffedc;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  width: 300px;
}

.confirmation-message {
  font-size: 18px;
  font-weight: bold;
  color: #724a0e;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.cancel-button {
  background: white;
  color: #ffab5e;
  border: 2px solid #ffab5e;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.cancel-button:hover {
  background: #ffe0c2;
}

.confirm-button {
  background: #ffab5e;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.confirm-button:hover {
  background: #ffc486;
}
</style>
  