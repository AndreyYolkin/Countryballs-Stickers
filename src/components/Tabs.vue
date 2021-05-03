<template>
  <div>
    <v-tabs
      v-model="tab"
      background-color="#f0f0f0"
      color="#7b2cbf"
      class="tw-flex-grow-0"
      center-active
      show-arrows
      fixed-tabs
    >
      <v-tab>
        <v-icon>mdi-web</v-icon>
      </v-tab>
      <v-tab disabled>
        <v-icon>mdi-image</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>mdi-eye</v-icon>
      </v-tab>
      <v-tab disabled>
        <v-icon>mdi-format-size</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>mdi-puzzle</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="tw-overflow-y-auto">
      <v-tab-item>
        <TabFlag @setflag="$emit('setflag', $event)" />
      </v-tab-item>
      <v-tab-item>
        <TabBack @setbg="$emit('setbg', $event)" />
      </v-tab-item>
      <v-tab-item>
        <TabEye @seteye="$emit('seteye', $event)" />
      </v-tab-item>
      <v-tab-item>
        <TabFlag />
      </v-tab-item>
      <v-tab-item>
        <TabAccessories @addaccessory="$emit('addaccessory', $event)" @deleteaccessories="$emit('deleteaccessories')" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import TabFlag from './TabFlag'
import TabBack from './TabBack'
import TabEye from './TabEye'
import TabAccessories from './TabAccessories.vue'
export default {
  components: {
    TabFlag,
    TabBack,
    TabEye,
    TabAccessories
  },
  data () {
    return {
      tab: 0,
    }
  },
}
</script>

<style>
</style>
