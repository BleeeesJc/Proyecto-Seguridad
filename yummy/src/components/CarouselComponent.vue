<template>
  <div id="enhancedCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
    <!-- Indicadores -->
    <div class="carousel-indicators">
      <button
        v-for="(image, index) in images"
        :key="index"
        type="button"
        :data-bs-target="'#enhancedCarousel'"
        :data-bs-slide-to="index"
        :class="{ active: index === 0 }"
        :aria-current="index === 0 ? 'true' : null"
        :aria-label="'Slide ' + (index + 1)"
      ></button>
    </div>

    <!-- Carrusel de Imágenes -->
    <div class="carousel-inner">
      <div
        v-for="(image, index) in images"
        :key="index"
        :class="['carousel-item', { active: index === 0 }]"
      >
        <img :src="image.src" :alt="image.alt" class="d-block w-100">
        <div class="carousel-caption d-none d-md-block">
          <h5>{{ image.title }}</h5>
          <p>{{ image.description }}</p>
        </div>
      </div>
    </div>

    <!-- Controles Anterior y Siguiente -->
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#enhancedCarousel"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#enhancedCarousel"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Siguiente</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "CarouselComponent",
  props: {
    images: {
      type: Array,
      required: true,
      default: () => [
        {
          src: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?cs=srgb&dl=pexels-pixabay-260922.jpg&fm=jpg",
          alt: "Imagen 1",
          title: "Elegancia en el Estilo",
          description: "Reserva alguna mesa en Yummy"
        },
        {
          src: "https://cdn.hellofresh.com/es/cms/SEO/recipes/gourmet/entrecot-de-ternera.jpeg",
          alt: "Imagen 2",
          title: "Más que comida, momentos.",
          description: "Experimenta los mejores sabores."
        },
        {
          src: "https://i.pinimg.com/1200x/41/56/6e/41566ee1e43c46ca0db336a4b0114d73.jpg",
          alt: "Imagen 3",
          title: "La bebida perfecta para cada ocasión.",
          description: "Bebidas refrescantes, sofisticadas y siempre listas para elevar tu momento. ¡Encuentra tu favorita!"
        }                
      ]
    }
  }
};
</script>

<style scoped>
.carousel-item img {
  height: 60vh;
  object-fit: cover;
  transition: transform 0.5s ease-in-out;
}

.carousel-caption {
  background: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
  padding: 10px;
  border-radius: 8px;
}

.carousel-item.active img {
  transform: scale(1.02); /* Efecto de zoom suave */
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: invert(1); /* Cambia los íconos de flecha a color claro */
}

.carousel-indicators button {
  background-color: #c89b3f; /* Color personalizado para los indicadores */
}

.carousel-indicators .active {
  background-color: #a87a4e; /* Color activo */
}

.carousel-caption {
  background: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
  padding: 10px;
  border-radius: 8px;
}

.carousel-item.active img {
  transform: scale(1.02); /* Efecto de zoom suave */
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: invert(1); /* Cambia los íconos de flecha a color claro */
}

.carousel-indicators button {
  background-color: #c89b3f; /* Color personalizado para los indicadores */
}

.carousel-indicators .active {
  background-color: #a87a4e; /* Color activo */
}
</style>