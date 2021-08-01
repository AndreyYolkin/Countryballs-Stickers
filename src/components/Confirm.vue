<template>
  <v-bottom-sheet
    v-model="sheet"
    inset
    persistent
  >
    <template #activator="{ on, attrs }">
      <span
        v-bind="attrs"
        class="vertical-middle"
        :class="absolute ? 'd-flex' : 'd-inline-flex'"
        v-on="on"
      >
        <slot>
          <v-btn text v-text="'Подтвердить'" />
        </slot>
      </span>
    </template>
    <v-sheet
      class="text-center"
      height="200px"
    >
      <div class="pt-6">
        <slot name="text">
          {{ text }}
        </slot>
      </div>
      <v-btn
        class="mt-6"
        text
        :color="declineColor"
        @click="decline()"
      >
        {{ declineText }}
      </v-btn>
      <v-btn
        class="mt-6"
        :color="confirmColor"
        @click="confirm()"
      >
        {{ confirmText }}
      </v-btn>
      <v-btn
        v-if="alterText"
        class="mt-6"
        :color="alterColor"
        @click="alter()"
      >
        {{ alterText }}
      </v-btn>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  name: 'Confirm',
  props: {
    confirmText: {
      type: String,
      default: 'Подтвердить'
    },
    alterText: {
      type: String,
      default: ''
    },
    declineText: {
      type: String,
      default: 'Отменить'
    },
    confirmColor: {
      type: String,
      default: 'primary'
    },
    alterColor: {
      type: String,
      default: 'warning'
    },
    declineColor: {
      type: String,
      default: 'remove'
    },
    text: {
      type: String,
      default: 'Подтверждаете это действие?'
    },
    absolute: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    sheet: false
  }),
  methods: {
    confirm() {
      this.sheet = !this.sheet
      this.$emit('confirm')
    },
    alter() {
      this.sheet = !this.sheet
      this.$emit('alter')
    },
    decline() {
      this.sheet = !this.sheet
      this.$emit('decline')
    }
  }
}
</script>

<style>
.vertical-middle {
  vertical-align: middle;
}
</style>
