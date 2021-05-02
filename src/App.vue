<template>
  <div id="app" class="tw-h-screen" data-app>
    <v-container class="tw-p-0 tw-h-full">
      <div
        class="tw-grid md:tw-grid-cols-2 md:tw-gap-4 tw-grid-cols-1 tw-grid-rows-auto tw-w-full tw-h-full tw-max-h-screen tw-auto-rows-fr"
      >
        <div class="tw-col-span-1 tw-self-center">
          <div class="tw-aspect-w-1 tw-aspect-h-1 tw-w-full tw-bg-red-100">
            <Canvas ref="canvas" />
          </div>
        </div>
        <div class="tw-col-span-1">
          <Tabs
            class="tw-h-full tw-max-h-screen tw-flex tw-flex-col"
            @setbg="log($event), $refs.canvas.setBg($event)"
          />
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs";
import Canvas from "@/components/Canvas";

export default {
  name: "App",
  components: {
    Tabs,
    Canvas,
  },
  methods: {
    log(...data) {
      console.log("data:", ...data);
    },
  },
};
</script>

<style>
.layout {
  padding: 0 0px;
  height: 100vh;
}

@media (min-width: 575.98px) {
  .layout {
    padding: 0 calc(50% - 270px);
  }
}

@media (min-width: 767.98px) {
  .layout {
    padding: 0 calc(50% - 360px);
  }
}

@media (min-width: 991.98px) {
  .layout {
    padding: 0 calc(50% - 480px);
  }
}

@media (min-width: 1199.98px) {
  .layout {
    padding: 0 calc(50% - 590px);
  }
}
</style>
