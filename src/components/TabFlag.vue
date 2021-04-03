<template>
  <div class="tw-max-h-full tw-overflow-y-auto">
    <vs-select label="Continent" v-model="continent">
      <vs-select-item
        :key="index"
        :value="item.value"
        :text="item.text"
        v-for="(item, index) in continents"
      />
    </vs-select>

    <vs-images>
      <vs-image :key="index" :src="getImgUrl(index)" v-for="(image, index) in 45" />
    </vs-images>
  </div>
</template>

<script>
export default {
  data: () => ({
    continent: "europe",
    continents: [
      { text: "Europe", value: "europe" },
      { text: "Asia", value: "asia" },
      { text: "America", value: "america" },
    ],
  }),
  methods: {
    getImgUrl(index) {
      var images = require.context("../assets/buttons/FL_EU", false, /\.png$/);
      return images("./" + index.toString().padStart(3, 0) + ".png");
    },
  },
};
</script>

<style>
</style>