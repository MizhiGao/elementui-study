<template>
  <div id="app">
    <div class="button__wrap">
      <el-button type="primary" size="mini" @click.stop="open"
        >点击打开抽屉</el-button>
    </div>
    <AllDetail :visible.sync="visible" :custom-type="detailData.type" :id.sync="detailData.id" @close="close" />
  </div>
</template>

<script>
import AllDetail from "./components/AllDetail.vue";

export default {
  name: "App",
  components: {
    AllDetail,
  },
  data() {
    return {
      visible: false,
      detailData:{
        type: '',
        id: 0,
      }
    };
  },
  methods: {
    open() {
      this.visible = true;
      this.detailData = {
        type: 'DrawerDemo',
        id: 1,
      }
    },
    close() {
      
    },
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
