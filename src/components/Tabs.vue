<template>
  <div>
    <v-tabs
      v-model="tab"
      background-color="#fafafa"
      color="primary"
      center-active
      show-arrows
      fixed-tabs
      class="tw-flex-grow-0 tw-flex-shrink-0"
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
      <v-tab>
        <v-icon>{{ mdiFormatSize }}</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>{{ mdiCog }}</v-icon>
      </v-tab>
    </v-tabs>
    <v-window v-model="tab" touchless class="tw-overflow-y-auto">
      <v-window-item>
        <TabFlag
          @custom="$emit('custom', 'flag')"
          @setflag="$emit('setflag', $event)"
          @setstroke="$emit('setstroke', $event)"
        />
      </v-window-item>
      <v-window-item>
        <TabEye @seteye="$emit('seteye', $event)" @seteyesposition="$emit('seteyesposition', $event)" />
      </v-window-item>
      <v-window-item>
        <TabBack @setback="$emit('setback', $event)" @custom="$emit('custom', 'back')" />
      </v-window-item>
      <v-window-item>
        <TabAccessories @addaccessory="$emit('addaccessory', $event)" @deleteaccessories="$emit('deleteaccessories')" />
      </v-window-item>
      <v-window-item>
        <TabText @createtextfield="$emit('createtextfield', $event)" @rerender="$emit('rerender')" />
      </v-window-item>
      <v-window-item>
        <TabSettings />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import { mdiWeb, mdiEye, mdiImage, mdiPuzzle, mdiCog, mdiFormatSize } from '@mdi/js'
import TabFlag from './TabFlag.vue'
import TabBack from './TabBack.vue'
import TabSettings from './TabSettings.vue'
import TabEye from './TabEye.vue'
import TabText from './TabText.vue'
import TabAccessories from './TabAccessories.vue'

export default {
  components: {
    TabFlag,
    TabSettings,
    TabBack,
    TabEye,
    TabText,
    TabAccessories
  },
  data () {
    return {
      tab: 0,
      mdiWeb,
      mdiEye,
      mdiImage,
      mdiPuzzle,
      mdiCog,
      mdiFormatSize
    }
  },
}
</script>

<style>
</style>
