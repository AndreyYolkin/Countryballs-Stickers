<template>
  <div class="tw-relative tw-w-full">
    <div class="tw-pt-4 tw-px-3 tw-flex tw-gap-2 tw-items-center tw-bg-white">
      <v-select
        v-model="background"
        :label="$t('app.backgroundLabel')"
        item-value="value"
        item-text="text"
        outlined
        dense
        hide-details
        :items="backgrounds"
      />
      <v-btn outlined height="40" color="primary" @click="$emit('custom')">
        {{ $t('app.custom') }}
      </v-btn>
    </div>
    <v-item-group mandatory>
      <v-container fluid>
        <v-row v-if="background === 'color'">
          <v-col cols="12" ref="pallete">
            <v-color-picker
              :key="palleteKey"
              v-model="color"
              :width="palleteWidth"
              mode="hexa"
              show-swatches
            />
          </v-col>
        </v-row>
        <v-row v-if="background !== 'color' && background !== 'transparent'">
          <v-col
            v-for="(image, index) in backs.keys()"
            :key="index"
            cols="4"
            md="3"
          >
            <v-item v-slot="{ active, toggle }">
              <v-card
                :image="getImgUrl(index)"
                class="d-flex align-center tw-aspect-w-1 tw-aspect-h-1"
                @click="$emit('setback', { index, pack: background }), toggle()"
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
import throttle from 'lodash/throttle'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      color: '#ffffff',
      backs: () => {},
      allBacks: () => [],
      palleteWidth: 400,
      palleteKey: 100,
      canvas: () => {},
      throttledSendColorBg: throttle(this.sendColorBg, 100),
      mdiCheck
    }
  },
  watch: {
    color: {
      handler() {
        if (this.background === 'color') {
          this.throttledSendColorBg(this.color)
        }
      },
      immediate: true
    },
    background() {
      if (this.background === 'transparent') {
        this.sendColorBg('transparent')
      } else if (this.background === 'color') {
        this.sendColorBg(this.color)
      } else {
        this.backs = this.allBacks[this.background]
      }
    }
  },
  computed: {
    backgrounds() {
      return this.$store.state.app.backgrounds
        .map(c => ({ text: this.$t(`app.backgrounds.${c}`), value: c }))
    },
    background: {
      get() {
        return this.$store.state.app.background
      },
      set(value) {
        this.$setBackground(value)
      }
    }
  },
  created() {
    this.loadBacks()
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    if (this.$refs.pallete) {
      this.palleteWidth = this.$refs.pallete.clientWidth
      this.palleteKey = this.palleteKey + 1
    }
    this.canvas = document.createElement('canvas')
    this.canvas.width = 720
    this.canvas.height = 720
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    ...mapMutations({
      $setBackground: 'setBackground'
    }),
    loadBacks() {
      this.allBacks = {
        BO: require.context('../assets/buttons/BG_BO', false, /\.png$/),
        GE: require.context('../assets/buttons/BG_GE', false, /\.png$/),
        ME: require.context('../assets/buttons/BG_ME', false, /\.png$/),
      }
      this.backs = this.allBacks.BO
    },
    getImgUrl(index) {
      return this.backs('./' + index.toString().padStart(3, 0) + '.png')
    },
    handleResize() {
      if (this.$refs.pallete) {
        this.palleteWidth = this.$refs.pallete.clientWidth
        this.palleteKey = this.palleteKey + 1
      }
    },
    sendColorBg(color) {
      const ctx = this.canvas.getContext('2d')
      ctx.clearRect(0, 0, 720, 720)
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 720, 720)
      this.$emit('setback', { url: this.canvas.toDataURL() })
    }
  },
}
</script>

<style>
</style>
