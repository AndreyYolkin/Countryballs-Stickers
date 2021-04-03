<template>
  <vs-tabs class="tw-flex tw-flex-col tabs">
    <vs-tab icon="language" label="">
      <div class="con-tab-ejemplo">
        <TabFlag/>
      </div>
    </vs-tab>
    <vs-tab icon="image" label="">
      <div class="con-tab-ejemplo">Service</div>
    </vs-tab>
    <vs-tab icon="visibility" label="">
      <div class="con-tab-ejemplo">login</div>
    </vs-tab>
    <vs-tab icon="text_fields" label="">
      <div class="con-tab-ejemplo"></div>
    </vs-tab>
  </vs-tabs>
</template>

<script>
import TabFlag from "./TabFlag";
export default {
  components: {
    TabFlag,
  },
};
</script>

<style>
.tabs.con-vs-tabs .con-slot-tabs {
    overflow-y: auto;
}
</style>