<template>
  <div>
    <v-tabs v-model="tab" background-color="#f0f0f0" color="#ea2" fixed-tabs>
      <v-tab>
        <v-icon>mdi-web</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>mdi-image</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>mdi-eye</v-icon>
      </v-tab>
      <v-tab>
        <v-icon>mdi-format-size</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="tw-overflow-y-auto">
      <v-tab-item>
        <TabFlag @setbg="$emit('setbg', $event)" />
      </v-tab-item>
      <v-tab-item>
        <TabFlag />
      </v-tab-item>
      <v-tab-item>
        <TabFlag />
      </v-tab-item>
      <v-tab-item>
        <TabFlag />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import TabFlag from "./TabFlag";
export default {
  components: {
    TabFlag,
  },
  data: function () {
    return {
      tab: 0,
    };
  },
};
</script>

<style>
</style>