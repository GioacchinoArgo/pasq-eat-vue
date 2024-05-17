<script>
import { RouterLink } from 'vue-router';

export default {
    name: 'AppHeader',
    props: { cartDishes: Array },
};
</script>

<template>
    <header>
        <nav class="container">

            <!-- Logo, parte sinistra -->
            <div class="logo">
                <RouterLink :to="{ name: 'home' }">
                    <figure>
                        <img src="/src/assets/img/pasqueat-logo.jpg" alt="PasqEat" class="img-fluid rounded-circle">
                    </figure>
                </RouterLink>
            </div>
            <!-- Carrello e registrazione, parte destra -->
            <div class="links">
                <ul>
                    <!-- Carrello -->
                    <li>
                        <RouterLink v-if="cartDishes.length" :to="{ name: 'checkout-page' }"
                            class=" btn-restaurant rounded-pill py-2 px-3 cart">
                            <img src="/src/assets/img/shopping-cart.png" alt="carrello" class="img-fluid">
                            <span>{{ cartDishes.length }}</span>
                        </RouterLink>
                    </li>

                    <!-- Registrati -->
                    <li>
                        <a href="http://127.0.0.1:8000/" class="btn btn-restaurant rounded-pill py-2 px-3"
                            target="_blank">Registrati</a>
                    </li>

                </ul>
            </div>
        </nav>
    </header>

</template>

<style lang="scss" scoped></style>