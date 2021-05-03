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
                :img="getImgUrl(index)"
                class="d-flex align-center tw-aspect-w-1 tw-aspect-h-1"
                @click="$emit('addaccessory', { index })"
              />
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
    <v-fab-transition>
      <v-btn
        v-if="selected"
        fab
        fixed
        left
        bottom
        color="#E53935"
      >
        <v-icon color="#fff" @click="$emit('deleteaccessories')">
          mdi-delete
        </v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      accessories: () => {},
    }
  },
  computed: {
    ...mapState({
      selected: state => state.selected.active
    })
  },
  created() {
    this.loadFlags()
  },
  methods: {
    ...mapMutations({
      $setContinent: 'setContinent'
    }),
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
