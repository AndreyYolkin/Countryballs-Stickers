<template>
  <div class="tw-relative tw-w-full tw-p-3">
    <v-select
      density="compact"
      variant="outlined"
      hide-details
      class="mb-4"
      v-model="$root.$i18n.locale"
      :prepend-inner-icon="mdiTranslate"
      :items="names"
    />
    <v-btn
      color="primary"
      variant="outlined"
    >
      Whats next?
      <v-dialog
        v-model="dialog"
        activator="parent"
      >
        <v-card>
          <v-card-text>
            <p class="mb-2">War is always bad and you should know it.</p>
            <p class="mb-2">There are no real weapons in this app, and they will never be added.</p>
            <p class="mb-2">But there are a lot updates, which I want to add instead of it. Some of them:
            <ol class="ml-6">
              <li>Historical countries</li>
              <li>Another shape of the flags</li>
              <li>Left and center look for countries</li>
              <li>Better text editor</li>
              <li>Free drawing mode</li>
            </ol>
            </p>
            <p>Find out what you can do to help people who suffered from
              military agression here:
              <v-btn
                target="_blank"
                variant="outlined"
                href="https://ukraineisforever.notion.site/How-you-can-support-Ukraine-8331e06fe69049debedad8f740dcd75c"
              >
                💙💛
              </v-btn>
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="dialog = false">Got it!</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
  </div>
</template>

<script>
import { mdiTranslate } from '@mdi/js'

import { Storage } from '@capacitor/storage'

export default {
  data() {
    return {
      dialog: false,
      light: 0,
      direction: 1,
      names: [
        { value: 'be', title: 'Беларускі' },
        { value: 'en', title: 'English' },
        { value: 'es', title: 'Español' },
        { value: 'pl', title: 'Polski' },
        { value: 'pt', title: 'Português' },
        { value: 'ru', title: 'Русский' },
        { value: 'ua', title: 'Український' },
      ],
      mdiTranslate
    }
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
