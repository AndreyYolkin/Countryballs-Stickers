<template>
  <div class="tw-relative tw-w-full">
    <v-item-group mandatory>
      <v-container fluid>
        <v-row>
          <v-col
            v-for="(image, index) in eyes.keys()"
            :key="index"
            cols="4"
            md="3"
          >
            <v-item v-slot="{ active, toggle }">
              <v-card
                :img="getImgUrl(index)"
                class="d-flex align-center tw-aspect-w-1 tw-aspect-h-1"
                @click="$emit('seteye', { index }), toggle()"
              >
                <v-scroll-y-transition>
                  <div
                    v-if="active"
                    class="tw-flex tw-justify-center tw-items-center tw-text-center"
                  >
                    <v-icon dark>
                      mdi-check
                    </v-icon>
                  </div>
                </v-scroll-y-transition>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      eyes: () => {},
    }
  },
  created() {
    this.loadFlags()
  },
  methods: {
    ...mapMutations({
      $setContinent: 'setContinent'
    }),
    loadFlags() {
      this.eyes = require.context('../assets/buttons/EY', false, /\.png$/)
    },
    getImgUrl(index) {
      return this.eyes('./' + index.toString().padStart(3, 0) + '.png')
    },
  },
}
</script>

<style>
</style>
