<template>
  <li class="cards_item">
    <div class="card">
      <div class="card_image">
        <img
          :src="imageSrc"
          :alt="imageAlt"
        />
      </div>
      <div class="card_content">
        <h2 class="card_title">{{ title }}</h2>
        <div class="card_text">
          <p>{{ description }}</p>
          <hr />
          <p>{{ extraText }}</p>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: "CardComponent",
  props: {
    imageSrc: {
      type: String,
      required: true
    },
    imageAlt: {
      type: String,
      default: "Imagen de tarjeta"
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    extraText: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped>
.cards_item {
  display: flex;
  padding: 1rem;
  transition: transform 0.3s ease-in-out;
}

.cards_item:hover {
  transform: scale(1.05); 
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); 
}

.card {
  background-color: white;
  border-radius: 0.25rem;
  box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card_content {
  position: relative;
  padding: 16px 12px 32px 24px;
  margin: 16px 8px 8px 0;
  max-height: 250px;
  overflow-y: scroll;
}

.card_content::-webkit-scrollbar {
  width: 8px;
}

.card_content::-webkit-scrollbar-track {
  box-shadow: 0;
  border-radius: 0;
}

.card_content::-webkit-scrollbar-thumb {
  background: #724A0E;
  border-radius: 15px;
}

.card_title {
  position: relative;
  margin: 0 0 24px;
  padding-bottom: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
}

.card_title::after {
  position: absolute;
  display: block;
  width: 50px;
  height: 2px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #724A0E;
  content: "";
}

.card_text p {
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 1.5;
}

.card_text p:last-child {
  margin: 0;
}

.card_image {
  position: relative;
  max-height: 250px;
}

.card_image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
