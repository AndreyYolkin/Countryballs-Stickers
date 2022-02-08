<template>
  <div class="tw-relative tw-w-full tw-p-3">
    <v-btn block v-text="'Add'" @click="createTextField" />
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    createTextField() {
      this.$emit('createtextfield')
    }
  }
}
</script>

<style>

</style>
