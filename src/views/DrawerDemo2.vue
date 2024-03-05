<template>
  <MDrawer  :appendToBody="true"  v-bind="$attrs" @close="hiddenView">
    <div>抽屉内容2</div>
  </MDrawer>
</template>

<script>
import MDrawer from "../components/Drawer/index.vue";
export default {
  name: "DrawerDemo2",
  components: {
    MDrawer,
  },
  props: {
     // 详情信息id
    id: [String, Number],
  },
  methods: {
    hiddenView() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
