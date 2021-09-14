<template>
  <div class="tw-relative tw-w-full tw-p-3">
    <v-switch v-model="stroke" inset :label="$t('app.settings.legacy_stroke')" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      light: 0,
      direction: 1,
      stroke: false
    }
  },
  watch: {
    light() {
      this.$emit('light', this.light)
    },
    direction() {
      this.$emit('direction', this.direction)
    },
    stroke() {
      this.$emit('setstroke', ['circle', 'circle_legacy'][+this.stroke])
    }
  }
}
</script>

<style>

</style>
