<template>
  <div id="app">
    <span>自定义抽屉</span>
    <div class="com-wrap">
      <el-button type="primary" size="mini" @click.stop="open"
        >点击打开抽屉</el-button>
    </div>
    <span>自定义下拉选择框</span>
    <div class="com-wrap">
      <MSelect :request="request" style="width: 100%;" />
    </div>
    <AllDetail :visible.sync="visible" :custom-type="detailData.type" :id.sync="detailData.id" @close="close" />
    <span>选择器超出可视区域隐藏下拉框</span>
    <div class="select-com-wrap">
      <div ref="wrapperRef" class="view-container">
        <div v-for="item,index in 1" :key="item" class="select-container">
          <el-select :popper-append-to-body="true"  ref="selectRef" :data-index="index" popper-class="select-popper-class" v-model="select[item]" size="small">
            <el-option v-for="item in 10" :key="item" :value="item">{{ item }}</el-option>
          </el-select>
        </div>
      </div>
    </div>
    <span>empty状态展示</span>
    <div v-empty="isEmpty" xt-empty-text="可能已经离开了地球" xt-empty-icon="nopermission" class="box-wrap">
      <div>展示</div>
      <img src="./assets/logo.png" />
    </div>
  </div>
</template>

<script>
import AllDetail from "./components/AllDetail.vue";
import MSelect from "./components/Select/index";
export default {
  name: "App",
  components: {
    AllDetail,
    MSelect
  },
  data() {
    return {
      visible: false,
      detailData:{
        type: '',
        id: 0,
      },
      request:()=>{},
      select: {},
      isEmpty:true,
    };
  },
  created () {
    this.request = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const res = {
            data:[{id:1, realname:"管理员"}, {id:2, realname:"张三"}, {id:3, realname:"李四"}]
          }
          resolve(res)
        }, 300)
      })
    }
  },
  mounted () {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(entry)
          const { isIntersecting, target } = entry
          // isIntersecting表示是否出现在了root区域内
          if (!isIntersecting) {
            // 隐藏popover
            this.$refs.selectRef[target.dataset.index].blur()
          }
        })
      },
      {
        root: this.$refs.wrapperRef.$el
      }
    )
    this.$refs.selectRef.forEach(ele=>this.observer.observe(ele.$el)) //观察每一个选择器
  },
  beforeDestroy () {
    this.$refs.selectRef.forEach(ele=>this.observer.disconnect(ele.$el))
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
.com-wrap {
  width: 340px;
  padding: 20px 0;
}
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 20px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f5f5f5;
}
.select-com-wrap{
  width: 500px;
  height: 300px;
  overflow: auto;
  padding: 20px;
  border: 1px solid #2c3e50;
}
.view-container{
  padding: 300px 0 500px;
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: flex-start;
  flex: 1;
}
.select-container{
  margin-bottom: 30px;
}
.box-wrap{
  border: 1px solid seagreen;
  padding: 10px;
  margin: 10px auto;
}
</style>
