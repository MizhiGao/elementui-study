<template>
  <MDrawer v-bind="$attrs" @close="hiddenView">
    <div>抽屉内容</div>
  </MDrawer>
</template>

<script>
import MDrawer from "./Drawer/main.vue";
export default {
  name: "DrawerDemo",
  components: {
    MDrawer,
  },
  props: {},
  methods: {
    hiddenView() {
      this.$emit("close");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
