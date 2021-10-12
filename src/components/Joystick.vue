<template>
  <div
    class="vue-joystick"
    :style="style"
    @touchmove="handleTouch"
    @mousemove="handleMove"
    @mousedown="handleStart"
    @mouseup="handleRelease"
    @touchend="handleRelease"
  ></div>
</template>

<script>
// Original code from https://codesandbox.io/s/427pook0p9?file=/src/components/JoyStick.vue
export default {
  props: {
    color: {
      type: String,
      default: 'var(--v-primary-base)'
    },
    value: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0,
        angle: 0,
        speed: 0,
      })
    }
  },
  data() {
    return {
      isMouseDown: false
    }
  },
  computed: {
    style() {
      return {
        '--x': `${this.joystick.x + 76}px`,
        '--y': `${this.joystick.y + 76}px`,
        '--angle': `${this.joystick.angle}deg`,
        '--color': `${this.color}`
      }
    },
    joystick: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    handleStart() {
      this.isMouseDown = true
    },
    handleTouch({ touches: [touch] }) {
      const { clientX, clientY } = touch
      const { left: offsetLeft, top: offsetTop } = this.$el.getBoundingClientRect()
      const x = Math.round(clientX - offsetLeft - 80)
      const y = Math.round(clientY - offsetTop - 80)
      this.updatePosition(x, y)
    },
    handleMove({ clientX, clientY }) {
      if (!this.isMouseDown) {
        return
      }
      const { left: offsetLeft, top: offsetTop } = this.$el.getBoundingClientRect()
      const x = Math.round(clientX - offsetLeft - 80)
      const y = Math.round(clientY - offsetTop - 80)
      this.updatePosition(x, y)
    },
    handleRelease() {
      this.emitAll('release')
      this.isMouseDown = false
    },
    updatePosition(x, y) {
      const offset = 80 - 32
      const radians = Math.atan2(y, x)
      const angle = Math.round((radians * 180) / Math.PI, 4)
      this.$set(this.joystick, 'angle', angle + (angle > 90 ? -270 : 90))
      this.$set(this.joystick, 'speed', Math.min(
        Math.round(Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2))),
        80
      ))
      this.$set(this.joystick, 'x', this.joystick.speed > offset ? Math.cos(radians) * offset : x - 4)
      this.$set(this.joystick, 'y', this.joystick.speed >= offset ? Math.sin(radians) * offset : y - 4)
      this.emitAll()
    },
    emitAll(name = 'change') {
      this.$emit(name, this.joystick)
    }
  },
  mounted() {
    this.emitAll()
  }
}
</script>

<style>
.vue-joystick {
  display: inline-block;
  touch-action: none;
  background: white;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  position: relative;
  border: solid 4px var(--color);
}
.vue-joystick::before,
.vue-joystick::after {
  content: "";
  position: absolute;
}
.vue-joystick::before {
  left: 0;
  right: 0;
  margin: -32px;
  background: var(--color);
  height: 64px;
  width: 64px;
  border-radius: 50%;
  transform: translateX(var(--x)) translateY(var(--y));
}
</style>
