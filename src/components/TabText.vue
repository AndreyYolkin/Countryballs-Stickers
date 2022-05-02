<template>
  <div class="tw-relative tw-w-full tw-p-3">
    <v-btn
      class="mb-4"
      block
      variant="outlined"
      color="primary"
      v-text="$t('app.add')"
      @click="createTextField"
    />
    <v-row v-if="selectedTexts.length" density="compact">
      <v-col cols="6" md="6">
        <p class="mb-2">{{ $t("app.text.color") }}</p>
        <v-color-picker
          ref="pallete"
          :key="palleteKey"
          :model-value="selectedTexts[0].children[0].attrs.fill"
          :width="palleteWidth"
          mode="hexa"
          @update:model-value="changeFillColor"
        />
      </v-col>
      <v-col cols="6" md="6">
        <p class="mb-2">{{ $t("app.text.background") }}</p>
        <v-color-picker
          :key="palleteKey"
          :model-value="selectedTexts[0].children[1].attrs.fill"
          :width="palleteWidth"
          mode="hexa"
          @update:model-value="changeTextBackgroundColor"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useStore } from '../store'
export default {
  setup() {
    const store = useStore()
    return { store }
  },
  data() {
    return {
      palleteWidth: 400,
      palleteKey: 100,
    }
  },
  computed: {
    selectedTexts: {
      get() {
        return this.store.selected.texts
      },
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    if (this.$refs.pallete) {
      this.palleteWidth = this.$refs.pallete.clientWidth
      this.palleteKey = this.palleteKey + 1
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    createTextField() {
      this.$emit('createtextfield')
    },
    changeFillColor(color) {
      this.selectedTexts.forEach((text) => text.children[0].setAttr('fill', color))
    },
    changeTextBackgroundColor(color) {
      this.selectedTexts.forEach((text) => text.children[1].setAttr('fill', color))
    },
    handleResize() {
      if (this.$refs.pallete) {
        this.palleteWidth = this.$refs.pallete.clientWidth
        this.palleteKey = this.palleteKey + 1
      }
    },
  },
}
</script>

<style>
</style>
