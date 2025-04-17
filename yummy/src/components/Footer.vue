<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h5>Sobre Nosotros</h5>
          <p>Yummy, para saborear y compartir</p>
        </div>
        <div class="col-md-4">
          <h5>Contacto</h5>
          <p>Teléfono: +123 456 789</p>
          <p>Email: info@Yummy.com</p>
        </div>
        <div class="col-md-4">
          <h5>Nuestras redes sociales</h5>
          <div class="social-links">
            <a href="https://www.facebook.com/Yummy" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook--v1.png" alt="Facebook" class="social-icon">
              Facebook
            </a>
            <a href="https://www.instagram.com/Yummy" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" class="social-icon">
              Instagram
            </a>
            <a href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.068280228346!2d-68.1145714889087!3d-16.522650184158717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f20ee187a3103%3A0x2f2bb2b7df32a24d!2sUniversidad%20Cat%C3%B3lica%20Boliviana%20%22San%20Pablo%22!5e0!3m2!1ses!2sbo!4v1729875829431!5m2!1ses!2sbo" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/ios-filled/50/ffffff/marker.png" alt="GoogleMaps" class="social-icon"> 
              Ubicación
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
  
  <script>
  export default {
    name: "FooterComponent",
  };
  </script>
  
  

<style scoped>
    .footer {
    background-color: #A16F23; 
    color: #fff; 
    padding: 40px 0;
  }

  .footer h5 {
    color: #fff; 
    margin-bottom: 20px;
  }

  .footer p {
    color: #fff; 
  }

  .footer a {
    color: #fff; 
    text-decoration: none; 
  }

  .footer a:hover {
    text-decoration: underline;
  }

  .footer .text-center {
    border-top: 1px solid #fff; 
    padding-top: 20px;
  }
</style>
