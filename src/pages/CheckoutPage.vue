<script>
import axios from 'axios';
import { store } from '../data/store';

const endpoint = 'http://localhost:8000/api/restaurants/restaurant';
const tokenGenerateEndpoint = 'http://127.0.0.1:8000/api/orders/'

export default {
    name: 'CheckoutPage',
    props: { showCart: Boolean },
    emits: ['toggle-cart', 'remove-from-cart', 'handle-dish', 'remove-row', "empty-cart"],
    data: () => ({
        store,
        cartDishes: store.cartDishes,
        restaurant: [],
        token: '',
        formNotValidated: '',
        paymentDetails: {
            name: '',
            lastname: '',
            address: '',
            phone: '',
            email: '',
            card_number: '',
            card_expire_date: '',
            cvv_code: '',
            restaurant_id: store.cartDishes[0]?.restaurant_id,
            dishes: store.cartDishes,
            payment_method_nonce: 'fake-valid-nonce',
        },

        formValidationMessage: 'Attenzione! Alcuni campi sembrano errati o incompleti...',

        messages: {
            name_message: '',
            lastname_message: '',
            address_message: '',
            phone_message: '',
            email_message: '',
            card_number_message: '',
            card_expire_date_message: '',
            cvv_code_message: '',
        }
    }),
    methods: {

        //Mando l'evento al componente padre tramite metodo
        handleDish(dish) {
            this.$emit('handle-dish', dish);
        },

        //Mando l'evento al componente padre tramite metodo
        removeFromCart(dish) {
            this.$emit('remove-from-cart', dish);
        },

        //Mando l'evento al componente padre tramite metodo
        removeRow(dish) {
            this.$emit('remove-row', dish);
        },

        //Mando l'evento al componente padre tramite metodo
        emptyCart() {
            this.$emit('empty-cart');
        },

        //Recupero il ristorante del piatto contenuto nel carrello
        getRestaurant() {
            // Setto la flag del loder a true
            store.isLoading = true;
            const restaurantId = this.cartDishes[0]?.restaurant_id;
            axios.get(`${endpoint}/${restaurantId}`)
                .then(res => {
                    this.restaurant = res.data;
                })
                .catch(err => {
                    console.error(err.message)
                })
                .then(() => {
                    // Setto la flag del loder a false
                    store.isLoading = false;
                })
        },
        //Validazione lato client del Nome
        isNameValid() {

            // Inizia a validare solo se il campo none è vuoto
            if (this.paymentDetails.name) {
                if (this.paymentDetails.name.length < 3) {
                    this.messages.name_message = 'Il nome non è valido.';
                    return false;
                } else {
                    this.messages.name_message = 'Campo valido.';
                    return true;
                }
            }
            return null;
        },

        //Validazione lato client del Cognome
        isLastnameValid() {
            // Inizia a validare solo se il campo non è vuoto
            if (this.paymentDetails.lastname) {
                if (this.paymentDetails.lastname.length < 3) {
                    this.messages.lastname_message = 'Il cognome non è valido.';
                    return false;
                } else {
                    this.messages.lastname_message = 'Campo valido.';
                    return true;
                }
            }
            return null;
        },

        //Validazione lato client dell'indirizzo
        isAddressValid() {
            // Inizia a validare solo se il campo non è vuoto
            if (this.paymentDetails.address) {
                if (this.paymentDetails.address.length < 3) {
                    this.messages.address_message = 'L\'indirizzo non è valido.';
                    return false;
                } else {
                    this.messages.address_message = 'Campo valido.';
                    return true;
                }

            }
            return null;
        },

        //Validazione lato client del numero di telefono
        isPhoneValid() {
            // Inizia a validare solo se il campo non è vuoto
            if (this.paymentDetails.phone) {
                if (this.paymentDetails.phone.length != 10) {
                    this.messages.phone_message = 'Il numero di telefono non è valido.';
                    return false;
                } else {
                    this.messages.phone_message = 'Campo valido.';
                    return true;
                }
            }
            return null;
        },

        //Validazione lato client dell'email
        isEmailValid() {
            // Inizia a validare solo se il campo non è vuoto
            if (this.paymentDetails.email) {
                if (this.paymentDetails.email.length < 3 && !this.paymentDetails.email.includes('@') && !this.paymentDetails.email.includes('.it') && !this.paymentDetails.email.includes('.com')) {
                    this.messages.email_message = 'l\'email non è valida';
                    return false;
                } else {
                    this.messages.email_message = 'Campo valido.';
                    return true;
                }
            }
            return null;
        },

        //Validazione lato client del numero della carta di credito
        isCardNumberValid() {
            // Inizia a validare solo se il campo non è vuoto
            if (this.paymentDetails.card_number) {
                if (this.paymentDetails.card_number.length != 16) {
                    this.messages.card_number_message = 'Il campo deve contenere 16 numeri.';
                    return false;
                } else {
                    this.messages.card_number_message = 'Campo valido.';
                    return true;
                }
            }
            return null;
        },

        //Validazione lato client della data di scadenza della carta
        isExpireCardValid() {
            // Inizia a validare solo se il campo non è vuoto
            if (this.paymentDetails.card_expire_date) {
                if (this.paymentDetails.card_expire_date.length != 5) {
                    this.messages.card_expire_date_message = 'Il campo non è valido.';
                    return false;
                } else {
                    this.messages.card_expire_date_message = 'Campo valido.';
                    return true;
                }
            }
            return null;
        },

        //Validazione lato client del codice segreto(cvv)
        isCvvCardValid() {
            // Inizia a validare solo se il campo non è vuoto
            if (this.paymentDetails.cvv_code) {
                if (this.paymentDetails.cvv_code.length != 3) {
                    this.messages.cvv_code_message = 'Il campo deve contenere 3 numeri';
                    return false;
                } else {
                    this.messages.cvv_code_message = 'Campo valido.';
                    return true;
                }
            }
            return null;
        },

        //alla chiamata generate token faccio un double check dei campi, 
        // se qualche campo contiene dei valori non consentiti il form restituirà un errore
        formValidation() {

            if (this.isNameValid() && this.isLastnameValid() && this.isAddressValid()
                && this.isPhoneValid() && this.isEmailValid() && this.isCardNumberValid()
                && this.isExpireCardValid() && this.isCvvCardValid()) {
                this.generateToken();
            } else {
                console.error(this.formValidationMessage)
                return;
            }
        },

        generateToken() {
            store.isLoading = true;
            //Chiamata per generare il token
            axios.get(`${tokenGenerateEndpoint}generate`).
                then(res => {
                    this.token = res.data.token;
                })
                .catch(err => {
                    console.log(err);
                    store.isLoading = false;
                }).
                then(() => {
                    if (this.token) this.makePayment();
                    else return store.isLoading = false;
                })
        },

        makePayment() {
            //Chiamata per effettuare il pagamento
            axios.post(`${tokenGenerateEndpoint}make/payment`,
                { ...this.paymentDetails },
                { headers: { 'Content-type': 'multipart/form-data' } }).
                then(response => {
                    localStorage.setItem('resultPage', JSON.stringify(response.data));
                    console.log(response.data)
                })
                .catch(({ error, response }) => {
                    localStorage.setItem('resultPage', JSON.stringify(response.data));
                    console.error(error);
                    console.log(response.data.errors);
                    store.isLoading = false;
                    this.$router.push({ name: 'result-page' })
                }).
                then(() => {
                    store.cartDishes = [];
                    this.$router.push({ name: 'result-page' })
                    store.isLoading = false;
                })
        },

        formattedPrice(price) {
            return price.replace('.', ',')
        },

    },
    computed: {
        /*Faccio un ciclo su i piatti contenuti in cartItems
        se groupedItems non contiene l'id del piatto
        viene pushato altrimenti vuiene aumentata la quantita 
        del piatto */
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
        /*Calcolo il totale dell'ordine
        sommando i prezzi dei piatti in cartItems*/
        calculateTotal() {
            let totalOrder = 0;
            this.cartDishes.forEach(dish => {
                totalOrder += parseFloat(dish.price);
            });
            return totalOrder.toFixed(2)
        },
    },

    // Watch per monitorare le modifiche di store.cartDishes
    watch: {
        'store.cartDishes': function (newCartDishes) {
            // Aggiorna cartDishes con i nuovi dati dello store
            this.cartDishes = newCartDishes;
        }
    },
    created() {
        this.getRestaurant();
    },
}
</script>

<template>
    <section id="restaurant-show">
        <div class="container py-4" id="restaurant-show">

            <!-- Torna Indietro -->
            <RouterLink :to="{ name: 'home' }" class="btn rounded-5 border-0 mt-2">
                <font-awesome-icon :icon="['fas', 'arrow-left']" /> Torna indietro
            </RouterLink>

            <!-- Piatti e carrello -->
            <div class="row mt-3">
                <h1 class="text-center mb-4">{{ restaurant.restaurant_name }}</h1>

                <!-- Carrello -->
                <div class="col-12 col-sm-12 col-md-12 col-lg-5 mb-6">
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
                                    <button @click="$emit('remove-from-cart', dish)" class="dish-btn">
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
                        <div class="d-flex align-items-center justify-content-around btn-container mb-1">
                            <p class="fs-5 mb-0 lh-1 fw-medium">Prezzo Totale: {{ calculateTotal }}€ </p>
                        </div>

                    </div>
                </div>

                <div class="col-12 col-sm-12 col-md-12 col-lg-6" id="checkout-info">
                    <h3 class="mb-2">Procedi al pagamento</h3>

                    <!--Form-->
                    <form class="form" @submit.prevent>

                        <!--Nome del cliente-->
                        <div class="col-12 mb-3">
                            <label for="name" class="input_label mb-0 lh-1 fw-medium">Nome<span
                                    class="text-danger">*</span></label>
                            <input type="text" id="name" name="name" class="input_field form-control" placeholder="Nome"
                                v-model="paymentDetails.name"
                                :class="{ 'is-invalid': isNameValid() === false, 'is-valid': isNameValid() === true }"
                                @keyup="isNameValid">
                            <div class="form-message" v-if="this.messages.name_message.length"
                                :class="{ 'invalid-feedback': isNameValid() === false, 'valid-feedback': isNameValid() === true }">
                                <p>{{ this.messages.name_message }}</p>
                            </div>
                        </div>

                        <!--Cognome-->
                        <div class="col-12 mb-3">
                            <label for="lastname" class="input_label mb-0 lh-1 fw-medium">Cognome<span
                                    class="text-danger">*</span></label>
                            <input type="text" id="lastname" name="lastname" class="input_field form-control"
                                placeholder="Cognome" v-model="paymentDetails.lastname"
                                :class="{ 'is-invalid': isLastnameValid() === false, 'is-valid': isLastnameValid() === true }"
                                @keyup="isLastnameValid">
                            <div class="form-message" v-if="this.messages.lastname_message.length"
                                :class="{ 'invalid-feedback': isLastnameValid() === false, 'valid-feedback': isLastnameValid() === true }">
                                <p>{{ this.messages.lastname_message }}</p>
                            </div>
                        </div>

                        <!--Indirizzo-->
                        <div class="col-12 mb-3">
                            <label for="address" class="input_label mb-0 lh-1 fw-medium">Indirizzo<span
                                    class="text-danger">*</span></label>
                            <input type="text" id="address" name="address" class="input_field form-control"
                                placeholder="Indirizzo" v-model="paymentDetails.address"
                                :class="{ 'is-invalid': isAddressValid() === false, 'is-valid': isAddressValid() === true }"
                                @keyup="isAddressValid">
                            <div class="form-message" v-if="this.messages.address_message.length"
                                :class="{ 'invalid-feedback': isAddressValid() === false, 'valid-feedback': isAddressValid() === true }">
                                <p>{{ this.messages.address_message }}</p>
                            </div>
                        </div>

                        <!-- Numero di Telefono-->
                        <div class="col-12 mb-3">
                            <label for="phone" class="input_label mb-0 lh-1 fw-medium">Numero di Telefono<span
                                    class="text-danger">*</span></label>
                            <input type="text" id="phone" name="phone" class="input_field form-control"
                                placeholder="Numero di Telefono" v-model="paymentDetails.phone"
                                :class="{ 'is-invalid': isPhoneValid() === false, 'is-valid': isPhoneValid() === true }"
                                @keyup="isPhoneValid">
                            <div class="form-message" v-if="this.messages.phone_message.length"
                                :class="{ 'invalid-feedback': isPhoneValid() === false, 'valid-feedback': isPhoneValid() === true }">
                                <p>{{ this.messages.phone_message }}</p>
                            </div>
                        </div>

                        <!--Email-->
                        <div class="col-12 mb-3">
                            <label for="email" class="input_label">Email*</label>
                            <input type="text" id="email" name="email" class="input_field form-control"
                                placeholder="E-mail" v-model="paymentDetails.email"
                                :class="{ 'is-invalid': isEmailValid() === false, 'is-valid': isEmailValid() === true }"
                                @keyup="isEmailValid">
                            <div class="form-message" v-if="this.messages.email_message.length"
                                :class="{ 'invalid-feedback': isEmailValid() === false, 'valid-feedback': isEmailValid() === true }">
                                <p>{{ this.messages.email_message }}</p>
                            </div>
                        </div>
                        <hr>
                        <h4>Inserisci i dati della tua carta</h4>

                        <!--Numero della Carta-->
                        <div class="col-12 mb-3">
                            <label for="card_number" class="input_label mb-0 lh-1 fw-medium">Numero Carta<span
                                    class="text-danger">*</span></label>
                            <input type="text" id="card_number" name="card_number" class="input_field form-control"
                                placeholder="4356 0000 2222 4567" v-model="paymentDetails.card_number"
                                :class="{ 'is-invalid': isCardNumberValid() === false, 'is-valid': isCardNumberValid() === true }"
                                @keyup="isCardNumberValid" value="">
                            <div class="form-message" v-if="this.messages.card_number_message.length"
                                :class="{ 'invalid-feedback': isCardNumberValid() === false, 'valid-feedback': isCardNumberValid() === true }">
                                <p>{{ this.messages.card_number_message }}</p>
                            </div>
                        </div>

                        <!--Scadenza della Carta-->
                        <div class="col-12 mb-3">
                            <label for="card_expire_date" class="input_label mb-0 lh-1 fw-medium">Data Scadenza
                                <span class="text-danger">*</span></label>
                            <input type="text" id="card_expire_date" name="card_expire_date"
                                class="input_field form-control" placeholder="01/27"
                                v-model="paymentDetails.card_expire_date"
                                :class="{ 'is-invalid': isExpireCardValid() === false, 'is-valid': isExpireCardValid() === true }"
                                @keyup="isCardExpireValid" value="">
                            <div class="form-message" v-if="this.messages.card_expire_date_message.length"
                                :class="{ 'invalid-feedback': isExpireCardValid() === false, 'valid-feedback': isExpireCardValid() === true }">
                                <p>{{ this.messages.card_expire_date_message }}</p>
                            </div>
                        </div>

                        <!--Codice di Sicurezza-->
                        <div class="col-12 mb-3">
                            <label for="cvv_code" class="input_label mb-0 lh-1 fw-medium">CVV<span
                                    class="text-danger">*</span></label>
                            <input type="text" id="cvv_code" name="cvv_code" class="input_field form-control"
                                placeholder="CVV" v-model="paymentDetails.cvv_code"
                                :class="{ 'is-invalid': isCvvCardValid() === false, 'is-valid': isCvvCardValid() === true }"
                                @keyup="isCvvValid" value="">
                            <div class="form-message" v-if="this.messages.cvv_code_message.length"
                                :class="{ 'invalid-feedback': isCvvCardValid() === false, 'valid-feedback': isCvvCardValid() === true }">
                                <p>{{ this.messages.cvv_code_message }}</p>
                            </div>
                        </div>

                        <input type="hidden" id="nonce" name="payment_method_nonce"
                            v-model="paymentDetails.payment_method_nonce" />

                        <div class="d-flex gap-3 align-items-center mt-1">
                            <button class="btn rounded-pill border-0" @click="formValidation()">Paga</button>
                            <p class="mb-0">I campi contrassegnati con <span
                                    class="text-danger"><strong>*</strong></span> sono
                                obbligatori</p>
                        </div>
                    </form>
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