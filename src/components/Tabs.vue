<template>
  <div>
    <v-tabs
      v-model="tab"
      background-color="#f0f0f0"
      color="primary"
      center-active
      show-arrows
      fixed-tabs
      class="tw-flex-grow-0"
    >
      <v-tab>
        <v-icon>{{ mdiWeb }}</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>{{ mdiEye }}</v-icon>
      </v-tab>
      <v-tab disabled>
        <v-icon>{{ mdiImage }}</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>{{ mdiPuzzle }}</v-icon>
      </v-tab>
      <v-tab disabled>
        <v-icon>{{ mdiFormatSize }}</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="tw-overflow-y-auto">
      <v-tab-item>
        <TabFlag @setflag="$emit('setflag', $event)" @custom="$emit('custom', 'flag')" />
      </v-tab-item>
      <v-tab-item>
        <TabEye @seteye="$emit('seteye', $event)" />
      </v-tab-item>
      <v-tab-item disabled>
        <TabBack @setbg="$emit('setbg', $event)" />
      </v-tab-item>
      <v-tab-item>
        <TabAccessories @addaccessory="$emit('addaccessory', $event)" @deleteaccessories="$emit('deleteaccessories')" />
      </v-tab-item>
      <v-tab-item disabled>
        <div>Not ready yet</div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mdiWeb, mdiEye, mdiImage, mdiPuzzle, mdiFormatSize } from '@mdi/js'
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
      mdiWeb,
      mdiEye,
      mdiImage,
      mdiPuzzle,
      mdiFormatSize
    }
  },
}
</script>

<style>
</style>
