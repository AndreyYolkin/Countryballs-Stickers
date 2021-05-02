<template>
  <div class="tw-relative tw-w-full">
    <div class="tw-pt-4 tw-px-3 tw-bg-white">
      <v-select
        label="background"
        item-value="value"
        item-text="text"
        filled
        hide-details
        v-model="background"
        :items="backgrounds"
      />
    </div>
    <v-item-group mandatory>
      <v-container fluid>
        <row v-if="background === 'color'">
          <v-col cols="12">
            <v-color-picker 
              v-model="color"
              width="100%"
            />
          </v-col>
        </row>
        <v-row v-if="background !== 'color' && background !== 'transparent'">
          <v-col
            :key="index"
            v-for="(image, index) in flags.keys()"
            cols="4"
            md="3"
          >
            <v-item v-slot="{ active, toggle }">
              <v-card
                :img="getImgUrl(index)"
                class="d-flex align-center tw-aspect-w-1 tw-aspect-h-1"
                @click="$emit('setbg', index), toggle()"
              >
                <v-scroll-y-transition>
                  <div
                    v-if="active"
                    class="tw-flex tw-justify-center tw-items-center tw-text-center"
                  >
                    <v-icon dark>mdi-check</v-icon>
                  </div>
                </v-scroll-y-transition>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </div>
</template>

<script>
export default {
  data: () => ({
    color: "#ffffff",
    background: "color",
    backgrounds: [
      { text: "Color", value: "color" },
      { text: "Transparent", value: "transparent" },
    ],
    flags: () => {},
  }),
  created() {
    this.loadFlags();
  },
  methods: {
    loadFlags() {
      this.flags = require.context("../assets/buttons/FL_EU", false, /\.png$/);
    },
    getImgUrl(index) {
      return this.flags("./" + index.toString().padStart(3, 0) + ".png");
    },
  },
};
</script>

<style>
</style>