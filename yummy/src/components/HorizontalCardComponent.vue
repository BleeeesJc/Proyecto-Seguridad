<template>
    <li class="horizontal-card">
      <div class="horizontal-card-container">
        <div class="horizontal-card-image">
          <img
            :src="imageSrc"
            :alt="imageAlt"
          />
        </div>
        <div class="horizontal-card-content">
          <h2 class="horizontal-card-title">{{ title }}</h2>
          <div class="horizontal-card-text">
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
    name: "HorizontalCardComponent",
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
  .horizontal-card {
    display: flex;
    padding: 1rem;
    transition: transform 0.3s ease-in-out;
    list-style: none;
  }
  
  .horizontal-card-container {
    display: flex;
    background-color: white;
    border-radius: 0.25rem;
    box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    width: 100%;
    height: 200px; /* Menor altura para la tarjeta */
  }
  
  .horizontal-card:hover {
    transform: scale(1.02); 
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); 
  }
  
  .horizontal-card-image {
    width: 40%; /* Proporción de la tarjeta dedicada a la imagen */
    height: 100%;
  }
  
  .horizontal-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .horizontal-card-content {
    width: 60%; /* Proporción de la tarjeta dedicada al texto */
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .horizontal-card-title {
    font-size: 18px;
    font-weight: 700;
    color: #724A0E;
    margin-bottom: 8px;
  }
  
  .horizontal-card-title::after {
    content: "";
    display: block;
    width: 50px;
    height: 2px;
    background-color: #724A0E;
    margin-top: 4px;
  }
  
  .horizontal-card-text {
    font-size: 14px;
    line-height: 1.5;
  }
  
  .horizontal-card-text hr {
    margin: 12px 0;
    border: none;
    border-top: 1px solid #ccc;
  }
  </style>
  