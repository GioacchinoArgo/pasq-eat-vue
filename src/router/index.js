//Importo le funzioni di Vue Router
import { createRouter, createWebHistory } from 'vue-router';
//Importo le Pagine
import HomePage from '../pages/HomePage.vue';
import RestaurantShow from '../pages/RestaurantShow.vue'
// import RestaurantsList from '../components/restaurants/RestaurantsList.vue';
import CheckoutPage from '../pages/CheckoutPage.vue'
import ResultPage from '../pages/ResultPage.vue'

//Definisco le rotte
const router = createRouter({
    history: createWebHistory(),

    linkActiveClass: 'partial-active',
    linkExactActiveClass: 'active',
    routes: [
        //Rotta della HomePage
        { path: '/', name: 'home', component: HomePage },

        // { path: '/restaurants', name: 'restaurants', component: HomePage },

        //Rotta per la vista del singolo Ristorante
        { path: '/restaurants/:slug', name: 'restaurant-show', component: RestaurantShow },
        //Rotta per il checkout
        { path: '/checkout-page', name: 'checkout-page', component: CheckoutPage },
        //Rotta per esito transazione
        { path: '/result-page', name: 'result-page', component: ResultPage }
    ]
});
export { router }