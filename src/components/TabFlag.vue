<template>
  <div class="tw-relative tw-w-full">
    <div class="tw-pt-4 tw-px-3 tw-flex tw-flex-col tw-gap-2 tw-items-center tw-bg-white">
      <div class="tw-flex tw-gap-2 tw-items-center tw-w-full">
        <v-select
          v-model="continent"
          :label="$t('app.continentLabel')"
          item-value="value"
          item-text="text"
          variant="outlined"
          density="compact"
          hide-details
          :items="continents"
        />
        <v-btn variant="outlined" color="primary" height="40" @click="$emit('custom')">
          {{ $t("app.custom") }}
        </v-btn>
      </div>
      <div class="tw-relative tw-w-full tw-px-3">
        <v-switch
          v-model="stroke"
          hide-details
          color="primary"
          class="mt-0 mb-0 tw-flex-grow-0 tw-w-fit"
          inset
          :label="$t('app.settings.legacy_stroke')"
        />
      </div>
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
                :key="continent + index"
                :image="getImgUrl(index)"
                class="d-flex align-center tw-aspect-w-1 tw-aspect-h-1"
                @click="$emit('setflag', { index, continent }), toggle()"
              >
                <v-scroll-y-transition>
                  <div
                    v-if="active"
                    class="
                      tw-flex tw-justify-center tw-items-center tw-text-center
                    "
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
import { useStore } from '../store'

export default {
  setup() {
    const store = useStore()
    return { store }
  },
  data() {
    return {
      allFlags: {},
      flags: () => {},
      stroke: false,
      mdiCheck,
    }
  },
  computed: {
    continents() {
      return this.store.app.continents.map((c) => ({
        text: this.$t(`app.continents.${c}`),
        title: this.$t(`app.continents.${c}`),
        value: c,
      }))
    },
    continent: {
      get() {
        return this.store.app.continent
      },
      set(value) {
        this.store.setContinent(value)
      },
    },
  },
  watch: {
    continent: {
      handler() {
        this.flags = this.allFlags[this.continent]
      },
      immediate: true,
    },
    stroke() {
      this.$emit('setstroke', ['circle', 'circle_legacy'][+this.stroke])
    },
  },
  created() {
    this.loadFlags()
  },
  methods: {
    loadFlags() {
      this.allFlags = {
        EU: require.context('../assets/buttons/FL_EU', false, /\.png$/),
        AS: require.context('../assets/buttons/FL_AS', false, /\.png$/),
        AM: require.context('../assets/buttons/FL_AM', false, /\.png$/),
        AU: require.context('../assets/buttons/FL_AU', false, /\.png$/),
        AF: require.context('../assets/buttons/FL_AF', false, /\.png$/),
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
