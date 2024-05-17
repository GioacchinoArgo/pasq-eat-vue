<script>
import axios from 'axios';
import { store } from '../data/store';

const defaultEndpoint = 'http://localhost:8000/api/restaurants/';

export default {
    name: 'RestaurantShow',
    emits: ['dish-cart', 'empty-cart', 'remove-from-cart', 'remove-row'],
    props: { cartDishes: Array },
    data: () => ({
        restaurant: {},
        dishes: {},
        store
    }),
    methods: {

        fetchRestaurantAndDishes() {
            // Setto la flag del loder a true
            store.isLoading = true;

            //Recupero lo slug
            const slug = this.$route.params.slug
            //Costruisco l'endpoint
            axios.get(`${defaultEndpoint}${slug}`)
                .then(res => {
                    //Faccio il destructuring
                    const { restaurant, restaurant_dishes } = res.data;
                    //Recupero i dati del ristorante
                    this.restaurant = restaurant
                    //prendo solo i piatti del ristorante
                    this.dishes = restaurant_dishes['dishes']
                })
                .catch(err => {
                    console.error(err.message)
                })
                .then(() => {
                    // Setto la flag del loder a false
                    store.isLoading = false;
                })
        },
        formattedPrice(price) {
            return price.replace('.', ',')
        },
        showMinus(id) {
            if (!this.cartDishes.length) return false;

            const minus = this.cartDishes.find(dish => dish.id === id)
            return minus;
        }
    },
    computed: {
        groupedCartDishes() {
            const groupedDishes = {};
            this.cartDishes.forEach(dish => {
                if (!groupedDishes[dish.id]) {
                    groupedDishes[dish.id] = { ...dish };
                } else {
                    groupedDishes[dish.id].quantity += 1;
                }
            });
            return Object.values(groupedDishes);
        },
        calculateTotal() {
            let totalOrder = 0;
            this.cartDishes.forEach(dish => {
                totalOrder += parseFloat(dish.price);
            });
            return totalOrder.toFixed(2)
        }
    },
    created() {
        this.fetchRestaurantAndDishes()
    }
}
</script>

<template>
    <section id="restaurant-show">
        <div class="container py-4">

            <RouterLink :to="{ name: 'home' }" class="btn rounded-5 mt-1">
                <font-awesome-icon :icon="['fas', 'arrow-left']" /> Torna indietro
            </RouterLink>

            <!-- Titolo e categorie -->
            <div class="d-flex align-items-center pt-5">
                <h1>{{ restaurant.restaurant_name }}</h1>
                <ul class="d-flex gap-3 align-items-center mb-0 list-filter">
                    <li v-for="category in restaurant.categories">
                        <div class="icon-bg selected">
                            <img :src="category.img" :alt="category.label" class="category-image-sm">
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Piatti e carrello -->
            <div class="row mt-3">

                <!-- Piatti -->
                <div class="col col-lg-8">

                    <!-- Titolo -->
                    <div class="d-flex align-items-center">
                        <img src="/src/assets/img/menu.png" alt="Menu" class="menu-img">
                        <h3 class="mb-0">Menu</h3>
                    </div>

                    <!-- Card dei piatti -->
                    <div v-for="dish in dishes" class="dish-card border-1 border-bottom border-secondary-subtle">
                        <div class="row">
                            <div class="col-3">
                                <img :src="dish.image" :alt="dish.name" class="dish-img">
                            </div>
                            <div class="col">
                                <h6>{{ dish.name }}</h6>
                                <p>{{ dish.ingredients }}</p>
                            </div>
                            <div class="col-2">
                                <h6 class="mb-5 text-center">{{ formattedPrice(dish.price) }}€</h6>
                                <div class="d-flex">

                                    <!-- Bottone Rimozione -->
                                    <button v-if="showMinus(dish.id)" @click="$emit('remove-from-cart', dish)"
                                        class="dish-btn">
                                        <FontAwesomeIcon :icon="['fas', 'minus']" />
                                    </button>

                                    <!-- Bottone Aggiunta -->
                                    <button @click="$emit('dish-cart', dish)" class="dish-btn ms-auto">
                                        <FontAwesomeIcon :icon="['fas', 'plus']" />
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottoni CheckOut md -->
                <div v-if="cartDishes.length" class="d-flex justify-content-center gap-4 price-btn">

                    <!-- Bottone Ordina -->
                    <RouterLink :to="{ name: 'checkout-page' }" class="btn w-50 rounded-5 d-lg-none">
                        Ordinane <strong>{{ cartDishes.length }}</strong> a <strong>{{ calculateTotal }} €</strong>
                    </RouterLink>

                    <!-- Bottone Svuota -->
                    <button @click="$emit('empty-cart')" class="btn btn-remove w-25 rounded-5 d-lg-none">
                        Svuota
                    </button>
                </div>

                <!-- Carrello -->
                <div class="d-none d-lg-block col-lg-4">
                    <div class="cart-card">

                        <!-- Titolo -->
                        <div class="d-flex align-items-center justify-content-center cart-title gap-2">
                            <img src="/src/assets/img/shopping-bag.png" alt="Carrello" class="menu-img">
                            <h3 class="mb-0">Il tuo ordine</h3>
                        </div>

                        <!-- Contenuto del Carello -->
                        <div class="cart-content">
                            <div class="row align-items-center my-3" v-for="dish in groupedCartDishes" :key="dish.id">

                                <!-- Quantità - Nome prodotto - Prezzo -->
                                <div class="col-2 text-end">

                                    <!-- Quantità -->
                                    <p class="fs-5 mb-0"><strong>{{ dish.quantity }}x</strong></p>
                                </div>
                                <div class="col">

                                    <!-- Nome del prodotto -->
                                    <p class="fs-5 mb-0 lh-1 fw-medium">{{ dish.name }}</p>
                                </div>
                                <div class="col-3">

                                    <!-- Prezzo -->
                                    <p class="fs-5 mb-0"><strong>{{ formattedPrice(dish.price) }} €</strong></p>
                                </div>

                                <!-- Bottoni Carrello -->
                                <div class="col-12 d-flex justify-content-around align-items-center py-4">

                                    <!-- Bottone Rimozione -->
                                    <button v-if="showMinus(dish.id)" @click="$emit('remove-from-cart', dish)"
                                        class="dish-btn">
                                        <FontAwesomeIcon :icon="['fas', 'minus']" />
                                    </button>

                                    <!-- Bottone rimozione riga -->
                                    <button @click="$emit('remove-row', dish)" class="btn btn-sm btn-remove rounded-5">
                                        Rimuovi
                                    </button>

                                    <!-- Bottone Aggiunta -->
                                    <button @click="$emit('dish-cart', dish)" class="dish-btn">
                                        <FontAwesomeIcon :icon="['fas', 'plus']" />
                                    </button>

                                </div>

                            </div>
                        </div>

                        <!-- Bottone CheckOut lg -->
                        <div class="d-flex align-items-center justify-content-center btn-container gap-2">

                            <!-- Bottone Ordina -->
                            <RouterLink :to="{ name: 'checkout-page' }" v-if="cartDishes.length"
                                class="btn rounded-5 mt-2">
                                Ordina
                                <strong>{{ cartDishes.length }}</strong>
                                a
                                <strong>{{ calculateTotal }} €</strong>
                            </RouterLink>

                            <!-- Bottone Svuota -->
                            <button @click="$emit('empty-cart')" v-if="cartDishes.length"
                                class="btn btn-remove rounded-5 mt-2">
                                Svuota
                            </button>

                        </div>

                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<style lang="scss" scoped>
#restaurant-show {
    ul {
        list-style: none;
    }
}

.list-filter {
    .icon-bg {
        border-radius: 39% 61% 45% 55% / 62% 56% 44% 38%;
        background-color: #27cabc56;
        padding: 12px;

        &.selected {
            background-color: #2CCCBC;
        }

        img {
            width: 30px;
            height: auto;
            margin: auto;
        }
    }


    span {
        font-size: 16px;
        font-weight: 500;
    }
}

.menu-img {
    width: 40px;
    height: auto;
}

.dish-card {

    padding: 30px 0;

    .dish-img {
        height: 120px;
        margin: 0;
        width: 120px;
        border-radius: 20px;
    }

    transition: transform 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: scale(1.03);

    }

}

.dish-btn {
    border-radius: 50%;
    border: 0;
    color: #2CCCBC;
    background-color: #00a08323;
}

.price-btn {
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
}

.btn {
    color: #fff;
    font-weight: 600;
    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.7);
    border: none;

    background-color: #ffb10a;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;

    &:hover {
        background-color: #ffc342;
        color: #fff;
    }
}

// Da cambiare
.btn-remove {
    background-color: #F73F34;

    &:hover {
        background-color: red;
        color: #fff;
    }
}

.cart-card {
    background-color: #fff;
    box-shadow: rgba(50, 50, 93, 0.2) 0px 13px 27px -5px, rgba(0, 0, 0, 0.2) 0px 8px 16px -8px;

    border-radius: 20px;

    position: sticky;
    left: 0;
    top: 0;
}

.cart-title {
    height: 100px;
}

.btn-container {
    height: 80px;
}

.cart-content {
    min-height: calc(400px - 180px);
    max-height: calc(600px - 180px);
    overflow: auto;
    overflow-x: hidden;
}


// Scrollbar
.cart-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.cart-content::-webkit-scrollbar-thumb {
    background-color: #ffb10a;
    border-radius: 4px;
}

.cart-content::-webkit-scrollbar-thumb:hover {
    background-color: #ffc342;
}

.cart-content::-webkit-scrollbar-track {
    background-color: transparent;
}
</style>