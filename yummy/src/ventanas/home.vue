<template>
    <div>
      <CarouselComponent />

      <div class="descripcion">
        <h1>Desde platos clásicos hasta creaciones innovadoras, nuestro menú está diseñado para complacer todos los paladares. Ya sea que vengas a disfrutar de un brunch relajado, una cena en familia o una ocasión especial, en Yummy siempre encontrarás sabor, calidad y una atención cálida. ¡Te invitamos a explorar nuestras deliciosas opciones y a descubrir por qué Yummy es el restaurante favorito para toda la familia!</h1>
      </div>
  
      <div class="main">
        <ul class="cards">
          <CardComponent
            imageSrc="https://media.citybeat.com/citybeat/imager/the-25-best-restaurants-in-greater-cincinnati-right-now-according-to-yelp/u/zoom/14734515/bakerstable_hb-4234.jpg?cb=1724366981"
            imageAlt="QuienesSomos"
            title="Quiénes somos"
            description="Yummy es más que un restaurante, es un lugar donde la comida se convierte en una experiencia inolvidable. Con un ambiente acogedor y familiar, es el destino perfecto para disfrutar de momentos especiales junto a tus seres queridos."
            extraText="¡Te invitamos a explorar nuestras instalaciones y a disfrutar de nuestros delicioso menú!"
          />
          <CardComponent
            imageSrc="https://www.agoda.com/wp-content/uploads/2019/03/Best-restaurants-in-Seoul-Fine-dining-Jungsik-Seoul-Mingles-restaurant.jpg"
            imageAlt="Misión"
            title="Nuestra Misión"
            description="En Yummy, nuestra misión es ofrecer una experiencia gastronómica excepcional que combina calidad, sabor y atención al cliente. Nos esforzamos por crear un ambiente acogedor y familiar donde cada plato esté hecho con ingredientes frescos y de la mejor calidad, garantizando una experiencia culinaria memorable."
            extraText="¡Disfruta cada momento con nosotros!"
          />

          <!-- Card de Visión -->
          <CardComponent
            imageSrc="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
            imageAlt="Visión"
            title="Nuestra Visión"
            description="Ser el restaurante de referencia para las familias y amigos que buscan compartir momentos especiales alrededor de la buena comida. Aspiramos a expandir nuestra marca, manteniendo siempre el compromiso con la calidad y la innovación en cada uno de nuestros platos."
            extraText="¡Creciendo contigo, plato a plato!"
          />
        </ul>
        <br>
        <h2>Lo que te ofrecemos</h2><br>
        <ul class="cards">
          <HorizontalCardComponent
            imageSrc="https://images.unsplash.com/photo-1547573854-74d2a71d0826?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVzYSUyMGRlJTIwY29taWRhfGVufDB8fDB8fHww"
            imageAlt="Menu"
            title="Acerca del Menú"
            description="En Yummy, hemos creado un menú cuidadosamente seleccionado para ofrecerte una experiencia gastronómica única. Desde entradas frescas y deliciosas, hasta platos principales que combinan lo mejor de la cocina tradicional e innovadora, nuestro menú es una celebración de sabores. También contamos con una irresistible variedad de postres para los amantes de lo dulce y una amplia selección de bebidas refrescantes para acompañar cada comida."
            extraText="¡Únete a esta deliciosa experiencia!"
          />
          <HorizontalCardComponent
            imageSrc="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c1050b145653163.62a1f338f3bd5.jpg"
            imageAlt="Pedidos"
            title="Para realizar pedidos"
            description="Disfruta de la comodidad de pedir tus platos favoritos de Yummy sin moverte de casa. Nuestro servicio te permite explorar el menú completo y hacer tus pedidos de forma rápida y sencilla. Además, si prefieres disfrutar de la experiencia en nuestro restaurante, puedes seleccionar tu mesa favorita y hacer una reserva para asegurar tu lugar."
            extraText="¡Tan sencillo como un click!"
          />
        </ul>
      </div>
      
      <!-- Importar y usar Footer -->
    </div>
  </template>
  
  <script>

  import CardComponent from '@/components/CardComponent.vue';
  import CarouselComponent from '@/components/CarouselComponent.vue';
  import HorizontalCardComponent from '@/components/HorizontalCardComponent.vue';
  
  export default {
    name: "HomePage",
    components: {

      CardComponent,
      CarouselComponent,
      HorizontalCardComponent,
    }
  };
  </script>
  
  <style scoped>

  .content {
    padding: 50px 20px;
    text-align: center;
    background-color: white;
  }
  body {
    font-family: "Oxygen", sans-serif;
    color: #050505;
    background-image: url('https://b2090723.smushcdn.com/2090723/wp-content/uploads/2019/03/DSC_0614.jpg?lossy=0&strip=0&webp=1');
    background-size: cover; 
    background-position: center; 
    background-repeat: no-repeat; 
}
  .title-fade {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 100%;
    color: white;
    opacity: 0; 
    animation: fadeIn 3s ease-in-out forwards;
    z-index: 10; 
  }
  
  .main {
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 75px;
    margin-bottom: 100px;
  }
  .descripcion h1{
    font-size: 2.8vh;
    display: block;
    text-align: center;
    padding-right: 5%;
    padding-left: 5%;
    padding-top: 5%;
    padding-bottom: 0%;
  }
  .cards {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .main h2{
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 3.2vh;
    color: #724A0E;
    display: block;
    text-align: left;
  }
  @media (min-width: 40rem) {
    .cards_item {
      width: 50%;
    }
  }
  
  @media (min-width: 56rem) {
    .cards_item {
      width: 33.3333%;
    }
  }
  
  
  hr {
    margin: 24px auto;
    width: 50px;
    border-top: 2px solid #c89b3f;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  </style>
  