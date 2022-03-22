<template>
  <div class="tw-relative tw-w-full">
    <div class="tw-pt-4 tw-px-3 tw-relative tw-bg-white">
      <v-btn outlined color="primary" height="40" @click="toggleJoystick()">
        {{ $t('app.joystick') }}
      </v-btn>
    </div>
    <div v-if="displayJoystick" class="tw-flex tw-mt-4 tw-flex-col tw-items-center tw-relative">
      <Joystick v-model="eyeStick" />
      <div class="tw-absolute  tw-top-0 tw-left-3 ">
        <div class="tw-flex text--secondary">
          <div class="tw-w-12">X: {{ ~~eyeStick.x }}</div>
          <div class="tw-w-12">Y: {{ ~~eyeStick.y }}</div>
        </div>
        <v-btn outlined color="#5567EC" @click="resetJoystick()">
          X:0 Y:0
        </v-btn>
      </div>
    </div>
    <v-item-group mandatory v-else>
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
                :image="getImgUrl(index)"
                class="d-flex align-center tw-aspect-w-1 tw-aspect-h-1"
                @click="$emit('seteye', { index }), toggle()"
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
import Joystick from './Joystick.vue'

const defaultEyeStick = { x: 0, y: 0, speed: 0, angle: 0 }

export default {
  components: { Joystick },
  data() {
    return {
      eyes: () => {},
      eyeStick: { ...defaultEyeStick },
      displayJoystick: false,
      mdiCheck
    }
  },
  created() {
    this.loadEyes()
  },
  watch: {
    eyeStick: {
      handler() {
        this.$emit('seteyesposition', this.eyeStick)
      },
      deep: true
    }
  },
  methods: {
    toggleJoystick() {
      this.displayJoystick = !this.displayJoystick
    },
    resetJoystick() {
      this.eyeStick = { ...defaultEyeStick }
    },
    handleChange({ x, y, speed, angle }) {
      this.eyeStick = { x, y, speed, angle }
    },
    loadEyes() {
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
