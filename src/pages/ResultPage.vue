<script>
//registro lo store
import { store } from '../data/store';
export default {
    name: 'ResultPage',
    data: () => ({
        store,
        apiResponse: [],
        customer_name: '',
        customer_lastname: '',
        customer_phone: '',
        customer_address: '',
        total: '',
    }),
    methods: {
        test() {
            this.apiResponse = JSON.parse(localStorage.getItem('resultPage'));
            this.customer_name = this.apiResponse.name;
            this.customer_lastname = this.apiResponse.lastname;
            this.customer_phone = this.apiResponse.phone;
            this.customer_address = this.apiResponse.address;
            this.total = this.apiResponse.total;
            if (this.apiResponse.succes) {
                localStorage.clear();
            }
        }
    },
    mounted() {
        this.test()
    }
};
</script>


<template>

    <div class="container checkout mt-5">
        <h2>Riepilogo Ordine: </h2>
        <hr>
        <p>Nome: <strong>{{ customer_name }}</strong></p>
        <p>Cognome: <strong>{{ customer_lastname }}</strong></p>
        <p>Telefono: <strong>{{ customer_phone }}</strong></p>
        <p>Indirizzo: <strong>{{ customer_address }}</strong></p>
        <p>Totale: <strong>{{ total }}</strong></p>

        <div class="d-flex align-items-center gap-1 my-4">
            <img :src="apiResponse.success ? '/src/assets/img/check.png' : '/src/assets/img/cross.png'" alt="#">
            <span>{{ apiResponse.message }}</span>
        </div>
        <!--Messaggio se la transazione va a buon fine-->
        <p v-if="apiResponse.success">Abbiamo ricevuto l'ordine!A breve ti arriverà la consegna.</p>

        <RouterLink :to="{ name: 'home' }">
            <button class="btn rounded-pill">
                <font-awesome-icon :icon="['fas', 'arrow-left']" /> Torna indietro
            </button>
        </RouterLink>
    </div>

</template>

<style lang="scss" scoped>
.checkout {
    padding: 50px;
}

img {
    width: 30px;
    height: 30px;
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
</style>