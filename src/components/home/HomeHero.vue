<script>
export default {
    name: 'HomeHero'
}
</script>

<template>
    <section class="hero">
        <div class="container">
            <div class="row align-items-center">

                <!-- Immagine -->
                <div class="col-12 col-lg-6 text-center">
                    <img src="../../assets/img/8219559_delivery_express_vespa_scooter_deliver_icon_1.png"
                        alt="Immagine Hero" class="hero-img">
                </div>

                <!-- Testo -->
                <div class="hero-col col-12 col-lg-6 text-center p-3">
                    <h1>Consegna di cibo a domicilio dai tuoi ristoranti preferiti</h1>
                    <p>I migliori ristoranti li trovi solo su PasqEat</p>

                    <a href="#home-page" class="btn btn-restaurant rounded-pill py-2 px-3">Ristoranti
                        <FontAwesomeIcon icon="fa-solid fa-arrow-down" class="fa-bounce arrow-down" />
                    </a>
                </div>

            </div>
        </div>
    </section>
</template>

<style lang="scss"></style>