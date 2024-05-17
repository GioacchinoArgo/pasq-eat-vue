<script>
import { RouterLink } from 'vue-router';

export default {
    name: 'RestaurantsList',
    props: { restaurants: Array }
}
</script>

<template>
    <div class="row mt-3">
        <div class="col-12 col-sm-6 col-md-6 col-lg-4 my-3" v-if="restaurants?.length" v-for="restaurant in restaurants"
            :key="restaurant.id">
            <!-- RestaurantctCard --> <!--Questo sarà un componente Card-->
            <RouterLink class="text-decoration-none"
                :to="{ name: 'restaurant-show', params: { slug: restaurant.slug } }">
                <div class="card rounded-3">
                    <img v-if="restaurant.image" :src="restaurant.image" class="img-fluid"
                        :alt="restaurant.restaurant_name">
                </div>
            </RouterLink>
            <div class="d-flex align-items-center justify-content-between">
                <h5 class="mt-3 ms-2 text-black">{{ restaurant.restaurant_name }}</h5>
                <ul class="d-flex gap-3 align-items-center mb-0 list-filter list-unstyled">
                    <li v-for="category in restaurant.categories">
                        <div class="catogry-label">
                            <img :src="category.img" :alt="category.label" class="category-image-sm">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <h4 v-else>Non ci sono Ristoranti</h4>
    </div>


</template>

<style></style>