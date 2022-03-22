<template>
  <div class="tw-relative tw-w-full tw-p-3">
    <v-select
      dense
      outlined
      v-model="$root.$i18n.locale"
      :prepend-inner-icon="mdiTranslate"
      :items="$root.$i18n.availableLocales"
    />
  </div>
</template>

<script>
import { mdiTranslate } from '@mdi/js'

import { Storage } from '@capacitor/storage'

export default {
  data() {
    return {
      light: 0,
      direction: 1,
      mdiTranslate
    }
  },
  mounted() {
    console.log(this.$root.$i18n.availableLocales)
  },
  watch: {
    light() {
      this.$emit('light', this.light)
    },
    direction() {
      this.$emit('direction', this.direction)
    },
    '$root.$i18n.locale': {
      handler(locale) {
        Storage.set({ key: 'language', value: locale })
      },
    },
  },
}
</script>

<style>
</style>
