<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { RouterView } from 'vue-router';
import { store } from './data/store';


export default {
  name: 'PasqEat',
  components: { AppHeader, AppFooter },
  data: () => ({
    showCart: false,
    store,
    cartDishes: [],
  }),
  methods: {

    //toggle del carrello
    toggleCart() {
      this.showCart = !this.showCart;
    },

    //recupero il piatto e lo rimuovo da cartItems
    removeFromCart(dish) {
      const dishToDelete = this.cartDishes.findIndex(item => {
        return item.id === dish.id
      })
      if (dishToDelete !== -1) {
        this.cartDishes.splice(dishToDelete, 1)
      }

    },

    //recupero il piatto e lo pusho in cartItems
    handleDish(dish) {

      const dishInfo = {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        restaurant_id: dish.restaurant_id,
        quantity: 1,
      }


      if (this.cartDishes.length === 0 || this.cartDishes[0].restaurant_id === dish.restaurant_id) {
        this.cartDishes.push(dishInfo)
      }
      else {
        return
      }
    },

    // rimuovo un prodotto e tutte le quantità di esso
    removeRow(dish) {
      this.cartDishes = this.cartDishes.filter(item => item.id !== dish.id);
      // una volta rimosso sincronizzo il localStorage e lo store
      this.updateLocalStorage();
    },

    // rimuovo un prodotto e tutte le quantità di esso
    emptyCart() {
      this.cartDishes = [];
      this.updateLocalStorage()
    },

    // sincronizzo localStorage e store
    updateLocalStorage() {
      localStorage.setItem('cartDishes', JSON.stringify(this.cartDishes));
      store.cartDishes = this.cartDishes;
    }

  },
  // Watch per monitorare le modifiche di store.cartDishes
  watch: {
    'store.cartDishes': function (newCartDishes) {
      // Aggiorna cartDishes con i nuovi dati dello store
      this.cartDishes = newCartDishes;
    }
  },
  created() {
    // Al caricamento della pagina sincronizzo i prodotti del carrello 
    // con quelli salvati in localstorage e store
    const savedCartDishes = localStorage.getItem('cartDishes');

    if (savedCartDishes) {
      this.cartDishes = JSON.parse(savedCartDishes);
      store.cartDishes = this.cartDishes;
    }

    //aggiungendo un eventlistener alla pagina sono in grado di salvare il cart in
    // localStorage prima della chiusura
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('cartDishes', JSON.stringify(this.cartDishes));
      store.cartDishes = this.cartDishes;
    });
  },
}

</script>

<template>

  <!-- Header -->
  <AppHeader :cartDishes="cartDishes" />

  <!-- Loader -->
  <AppLoader v-if="store.isLoading" />

  <!-- Main -->
  <main>

    <RouterView :cartDishes="cartDishes" @dish-cart="handleDish" @remove-from-cart="removeFromCart"
      @handle-dish="handleDish" @remove-row="removeRow" @empty-cart="emptyCart" />


    <!-- Footer -->
    <AppFooter v-if="!store.isLoading" />
  </main>


</template>

<style lang="scss">
@use './assets/scss/style.scss';
</style>