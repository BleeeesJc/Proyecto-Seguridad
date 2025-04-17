<template>
    <header class="custom-header">
      <h2>
        <i :class="icon"></i>
        {{ title }}
      </h2>
      <p>{{ subtitle }}</p>
    </header>
</template>

<script>
export default {
name: "HeaderAdminTitle",
props: {
    icon: {
    type: String,
    required: true,
    default: "fas fa-tags"
    },
    title: {
    type: String,
    required: true,
    default: "Ofertas"
    },
    subtitle: {
    type: String,
    required: true,
    default: "Administra y crea nuevas ofertas para tus clientes"
    }
}
};
</script>

<style scoped>
/* Encabezado general */
.custom-header {
text-align: center;
background: linear-gradient(180deg, #ff9900, #ffcc00);
color: white;
padding: 20px 10px;
border-radius: 0 0 15px 15px;
box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
margin-bottom: 20px;
}

/* Título principal */
.custom-header h2 {
font-size: 2.5em;
font-weight: bold;
margin: 0;
display: flex;
align-items: center;
justify-content: center;
gap: 10px;
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Icono decorativo */
.custom-header h2 i {
font-size: 0.8em;
color: #ffd700;
animation: bounce 1s infinite;
}

/* Subtítulo */
.custom-header p {
font-size: 1.2em;
margin-top: 10px;
color: #fff8e7;
font-style: italic;
}
</style>
  