<template>
  <div class="tw-relative tw-w-full">
    <v-item-group mandatory>
      <v-container fluid>
        <v-row>
          <v-col
            v-for="(image, index) in accessories.keys()"
            :key="index"
            cols="4"
            md="3"
          >
            <v-item>
              <v-card
                class="d-flex align-center"
                @click="$emit('addaccessory', { index })"
              >
                <v-img :src="getImgUrl(index)" aspect-ratio="1" contain />
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accessories: () => {},
    }
  },
  created() {
    this.loadFlags()
  },
  methods: {
    loadFlags() {
      this.accessories = require.context('../assets/buttons/AC', false, /\.png$/)
    },
    getImgUrl(index) {
      return this.accessories('./' + index.toString().padStart(3, 0) + '.png')
    },
  },
}
</script>

<style>
</style>
