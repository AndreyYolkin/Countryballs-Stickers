<template>
  <div class="tw-relative tw-w-full">
    <div class="tw-pt-4 tw-px-3 tw-bg-white">
      <v-select
        v-model="continent"
        :label="$t('app.continentLabel')"
        item-value="value"
        item-text="text"
        filled
        hide-details
        :items="continents"
      />
    </div>
    <v-item-group>
      <v-container fluid>
        <v-row>
          <v-col
            v-for="(image, index) in flags.keys()"
            :key="index"
            cols="4"
            md="3"
          >
            <v-item v-slot="{ active, toggle }">
              <v-card
                :img="getImgUrl(index)"
                class="d-flex align-center tw-aspect-w-1 tw-aspect-h-1"
                @click="$emit('setflag', { index, continent }), toggle()"
              >
                <v-scroll-y-transition>
                  <div
                    v-if="active"
                    class="tw-flex tw-justify-center tw-items-center tw-text-center"
                  >
                    <v-icon dark>
                      {{ mdiCheck }}
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
import { mdiCheck } from '@mdi/js'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      allFlags: {},
      flags: () => {},
      mdiCheck
    }
  },
  computed: {
    continents() {
      return this.$store.state.app.continents
        .map(c => ({ text: this.$t(`app.continents.${c}`), value: c }))
    },
    continent: {
      get() {
        return this.$store.state.app.continent
      },
      set(value) {
        this.$setContinent(value)
      }
    }
  },
  watch: {
    continent: {
      handler() {
        this.flags = this.allFlags[this.continent]
      },
      immediate: true
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
      this.allFlags = {
        EU: require.context('../assets/buttons/FL_EU', false, /\.png$/),
        AS: require.context('../assets/buttons/FL_AS', false, /\.png$/),
        AM: require.context('../assets/buttons/FL_AM', false, /\.png$/),
        AFAU: require.context('../assets/buttons/FL_AFAU', false, /\.png$/),
        OT: require.context('../assets/buttons/FL_OT', false, /\.png$/),
      }
      this.flags = this.allFlags[this.continent]
    },
    getImgUrl(index) {
      return this.flags('./' + index.toString().padStart(3, 0) + '.png')
    },
  },
}
</script>

<style>
</style>
