<template>
  <MDrawer  :appendToBody="false" v-bind="$attrs" @close="hiddenView">
    <div>抽屉内容1</div>
    <el-button type="primary" size="mini" @click="open()">打开抽屉2</el-button>
     <AllDetail :visible.sync="showDetail" :modal="true" :custom-type="relativeType" :id.sync="relativeId" @close="closeRelative" />
  </MDrawer>
</template>

<script>
import MDrawer from "../../components/Drawer/index.vue";
// import { AllDetail } from "../components/AllDetail.vue";

export default {
  name: "DrawerDemo",
  components: {
    MDrawer,
    AllDetail: () => import('../../components/AllDetail.vue'),
  },
  props: {
     // 详情信息id
    id: [String, Number],
  },
  data(){
    return{
      showDetail: false,
      relativeType: '',
      relativeId: ''
    }
  },
  methods: {
    hiddenView() {
      this.$emit("update:visible", false);
    },
    open(){
      this.relativeType = 'DrawerDemo2'
      this.relativeId = 2
      this.showDetail = true

    },
    closeRelative() {
      // this.showDetail = false
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
