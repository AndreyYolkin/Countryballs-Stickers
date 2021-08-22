<template>
  <div class="tw-relative tw-w-full tw-p-3">
    <v-slider v-model="light" label="Light direction" max="1" ticks="always"/>
    <v-slider v-model="direction" label="Eyes direction" max="1" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      light: 0,
      direction: 1
    }
  },
  watch: {
    light() {
      this.$emit('light', this.light)
    },
    direction() {
      this.$emit('direction', this.direction)
    },
  }
}
</script>

<style>

</style>
