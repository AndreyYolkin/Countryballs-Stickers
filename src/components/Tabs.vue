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
      <v-tab>
        <v-icon>{{ mdiImage }}</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>{{ mdiPuzzle }}</v-icon>
      </v-tab>
      <v-tab disabled>
        <v-icon>{{ mdiCog }}</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="tw-overflow-y-auto">
      <v-tab-item>
        <TabFlag @setflag="$emit('setflag', $event)" @custom="$emit('custom', 'flag')" />
      </v-tab-item>
      <v-tab-item>
        <TabEye @seteye="$emit('seteye', $event)" />
      </v-tab-item>
      <v-tab-item>
        <TabBack @setback="$emit('setback', $event)" @custom="$emit('custom', 'back')" />
      </v-tab-item>
      <v-tab-item>
        <TabAccessories @addaccessory="$emit('addaccessory', $event)" @deleteaccessories="$emit('deleteaccessories')" />
      </v-tab-item>
      <v-tab-item disabled>
        <TabSettings />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mdiWeb, mdiEye, mdiImage, mdiPuzzle, mdiCog } from '@mdi/js'
import TabFlag from './TabFlag.vue'
import TabBack from './TabBack.vue'
import TabSettings from './TabSettings.vue'
import TabEye from './TabEye.vue'
import TabAccessories from './TabAccessories.vue'

export default {
  components: {
    TabFlag,
    TabSettings,
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
      mdiCog
    }
  },
}
</script>

<style>
</style>
