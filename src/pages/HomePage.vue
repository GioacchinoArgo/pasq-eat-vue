<script>
import axios from 'axios';
import RestaurantsList from '../components/restaurants/RestaurantsList.vue';
import HomeHero from '../components/home/HomeHero.vue';
import { store } from '../data/store';

const defaultEndpoint = 'http://localhost:8000/api/restaurants/';
let endpoint = null;

export default {
    name: 'HomePage',
    components: { RestaurantsList, HomeHero },
    data: () => ({
        restaurants: [],
        categories: [],
        selectedCategoriesLabel: [],
        store
    }),
    methods: {
        //Chiamata axios per ricevere i ristoranti e le categorie
        getRestaurants() {
            // Setto la flag del loder a true
            store.isLoading = true;

            //Se ci sono categorie selezionate
            if (this.selectedCategoriesLabel.length > 0) {

                // Converto le etichette di categoria selezionate in una stringa di query
                const queryParams = this.selectedCategoriesLabel.join(',');
                endpoint = defaultEndpoint;

                //Aggiungo all'endpoint la chiave e la categoria
                endpoint += `?categories=${queryParams}`;
            }
            axios.get(endpoint ?? defaultEndpoint)
                .then(res => {
                    const { restaurants, categories } = res.data;
                    this.restaurants = restaurants;
                    this.categories = categories;
                })
                .catch(err => {
                    console.error(err.message)
                })

                //Riporto l'endpoint al valore di default
                .then(() => {
                    endpoint = defaultEndpoint;

                    // Setto la flag del loder a false
                    store.isLoading = false;
                })
        },

        //Funzione per aggiungere la categoria selezionata
        getSelectedCategories(label) {
            if (!this.selectedCategoriesLabel.includes(label)) {
                this.selectedCategoriesLabel.push(label);
            } else {
                this.selectedCategoriesLabel = this.selectedCategoriesLabel.filter(category => category !== label);
            }
            // Rieffettuo la chiamata con i nuovi filtri
            this.getRestaurants();
        },

        // Verifico se dentro selectedCategoriesLabel è inclusa una categoria, se è presente restituisce true
        isSelected(category) {
            return this.selectedCategoriesLabel.includes(category.label);
        }
    },

    created() {
        this.getRestaurants();
    }
}
</script>

<template>
    <div>
        <!-- Hero -->
        <HomeHero />

        <!-- Home Page -->
        <section class="container-fluid container-lg mb-5 justify-content-center" id="home-page">
            <!-- Filtri categorie -->
            <div class="d-lg-none upper-categories-filter">
                <div class="d-flex flex-wrap mt-4 justify-content-center">
                    <ul
                        class="list-unstyled list-filter gap-2 d-flex flex-wrap justify-content-center align-items-center">
                        <li v-for="category in categories" :key="category.id"
                            @click="getSelectedCategories(category.label)"
                            class="d-flex flex-row align-items-center my-2 me-2">
                            <div class="icon-bg" :class="{ 'selected': isSelected(category) }">
                                <img :src="category.img" :alt="category.label" class="category-image-sm">
                            </div>
                            <span class="mt-1 ms-2">{{ category.label }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Main Content -->
            <div class="d-flex gap-4 pt-5">
                <!-- Sidebar filtri categorie -->
                <nav class="side-bar d-none d-lg-block">
                    <h3 class="mb-0 pt-2">Filtri</h3>
                    <div class="side-categories-filter">
                        <div class="mt-4">
                            <ul class="list-unstyled list-filter">
                                <li v-for="category in categories" :key="category.id"
                                    @click="getSelectedCategories(category.label)"
                                    class="d-flex align-items-center my-3 pb-2 border-1 border-bottom border-secondary-subtle">
                                    <div class="icon-bg" :class="{ 'selected': isSelected(category) }">
                                        <img :src="category.img" :alt="category.label" class="category-image-sm">
                                    </div>
                                    <span class="mt-1 ms-2">{{ category.label }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <!-- Lista Ristoranti -->
                <div class="w-100 text-center text-lg-start">
                    <h1 class="d-inline">Ristoranti</h1>
                    <RestaurantsList :restaurants="restaurants" v-if="!store.isLoading"/>
                </div>
            </div>
        </section>
    </div>
</template>

<style></style>