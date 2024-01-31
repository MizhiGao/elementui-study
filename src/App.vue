<template>
  <div id="app">
    <div class="button__wrap">
      <el-button type="primary" size="mini" @click="open"
        >点击打开抽屉</el-button
      >
    </div>
    <drawer-demo :visible="visible" @close="close" />
  </div>
</template>

<script>
import DrawerDemo from "./components/DrawerDemo.vue";

export default {
  name: "App",
  components: {
    DrawerDemo,
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    close() {},
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
html,
body {
  width: 100%;
  height: 100%;
}
.button__wrap {
  width: 140px;
  padding: 20px;
}
#app {
  position: relative;
  height: 100%;
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f5f5f5;
}
</style>
