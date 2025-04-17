<!-- CardComponent.vue -->
<template>
    <div class="card-container">
        <img class="hero-image" :src="imageSrc"
                alt="Spinning glass cube" />
        <main class="main-content">
            <h1><a href="#">{{ title }}</a></h1>
            <p>{{ requirement }}, aplicando esta oferta en tus pedidos obtendras un {{ discount }}% de descuento</p>
            <div class="flex-row">
                <div class="coin-base">
                    <img src="https://i.postimg.cc/T1F1K0bW/Ethereum.png" alt="Ethereum" class="small-image" />
                    <h2>A partir del {{ dateInit }}</h2>
                </div>
                <div class="time-left">
                    <img src="https://i.postimg.cc/prpyV4mH/clock-selection-no-bg.png" alt="clock"
                        class="small-image" />
                    <p>{{ daysLeft }} días restantes</p>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
export default {
    name: "CardComponent",
    props: {
        imageSrc: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        requirement: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        dateInit: {
            type: String,
            required: true
        },
        dateEnd: {
            type: String,
            required: true
        }
    },
    computed: {
        daysLeft() {
        const end = new Date(this.dateEnd);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
        },
    },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');

/* Variables */
:root {
    --var-soft-blue: hsl(215, 51%, 70%);
    --var-cyan: hsl(178, 100%, 50%);
    --var-main-darkest: hsl(217, 54%, 11%);
    --var-card-dark: hsl(216, 50%, 16%);
    --var-line-dark: hsl(215, 32%, 27%);
    --var-lightest: white;
    --var-heading: normal normal 600 1.5em/1.6em 'Outfit', sans-serif;
    --var-small-heading: normal normal 400 1em/1em 'Outfit', sans-serif;
    --var-para: normal normal 300 1em/1.55em 'Outfit', sans-serif;
}

body {
    background-color: var(--var-main-darkest);
}

img {
    width: 100%;
    border-radius: 15px;
    display: block;
}

a {
    color: inherit;
    text-decoration: none;
}

/* Font Styling */
h1 {
    font: var(--var-heading);
    color: var(--var-lightest);
    padding: 1.2em 0;
}

h2 {
    font: var(--var-small-heading);
    color: var(--var-lightest);
}

p {
    font: var(--var-para);
    color: var(--var-soft-blue);
}

span {
    color: white;
}

.main-content {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    border-radius: 10px;
}

.card-container {
    width: 100%;
    max-width: 400px;
    margin: 2em auto;
    background-color: var(--var-card-dark);
    border-radius: 15px;
    padding: 2rem;
    background-color: rgb(232, 232, 232);
    box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
}

.flex-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.coin-base,
.time-left,
.card-attribute {
    display: flex;
    align-items: center;
    padding: 1em 0;
}

.card-attribute {
    padding-bottom: 1.5em;
    border-top: 2px solid var(--var-line-dark);
}

.hero-image-container {
    position: relative;
    display: block;
}

.hero-image-container:hover::after {
    opacity: 1;
}

.small-image {
    width: 1.2em;
    margin-right: 0.5em;
}

.small-avatar {
    width: 2em;
    border-radius: 200px;
    outline: 2px solid white;
    margin-right: 1.4em;
}

.attribution {
    margin: 0 auto;
    width: 100%;
    font: var(--var-para);
    text-align: center;
    padding: 1.5em 0 4em 0;
    color: var(--var-line-dark);
}

.attribution a {
    color: var(--var-soft-blue);
}

/* Responsive */
@media (min-width: 600px) {
    body {
        font-size: 18px;
    }
}
</style>