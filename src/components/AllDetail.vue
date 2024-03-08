<template>
  <component
    v-if="showDetail"
    :is="tabName"
    :custom-type="customType"
    :id="id"
    :visible.sync="showDetail"
    :modal="modal"
    v-bind="$attrs"
    v-on="$listeners"
    @handle="detailHandle"
    @hide-slide="hiddenDrawer"
    class="drawer-view"
  />
</template>

<script type="text/javascript">
import { getMaxIndex } from '@/utils/index'
import DrawerDemo from '../views/DrawerExample/DrawerDemo.vue'
import DrawerDemo2 from '../views/DrawerExample/DrawerDemo2.vue'
export default {
  name: 'AllDetail',
  components: {
    DrawerDemo,
    DrawerDemo2
  },
  props: {
    id:[String, Number],
    customType: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabName: '',
      showDetail: false
    }
  },
  watch:{
    visible: {
      handler(val) {
        console.log(val, this.showDetail);
        this.showDetail = val
        if(val){
          this.$nextTick(() => {
            console.log(this.$el)
            this.$el.addEventListener('click', this.handleDocumentClick, false)
            this.$el.style.zIndex = getMaxIndex()
          })
        }
      },
      immediate: true
    },

    customType(){
      this.tabName = this.customType
    }
  },
  mounted() {
    if (this.visible) {
      console.log(`$el:1`, this.$el)
      // this.$el.addEventListener('click', this.handleDocumentClick, false)
      this.$el.style.zIndex = getMaxIndex()
    }
  },
  beforeDestroy() {
    // remove DOM node after destroy
    console.log(`this.$el && this.$el.parentNode`, this.$el, this.$el.parentNode)
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
      // this.$el.removeEventListener('click', this.handleDocumentClick, false)
    }
  },
  destroyed() {

  },
  methods: {
    hiddenDrawer() {
      this.$emit('update:visible', false)
    },
    // handleDocumentClick(e) {
    //   // e.stopPropagation()
    //   console.log(this.$el == e.target, this.$el, e.target)
    //   if (this.$el == e.target) {
    //     this.showDetail = false
    //   }
    // },
    detailHandle(data) {
      this.hiddenDrawer()
      this.$emit('handle', data)
    }
  }


}
</script>

<style scoped>
.drawer-view {
  position: fixed;
  min-width: 926px;
  width: 75%;
  top: 0px;
  bottom: 0px;
  right: 0px;
}
</style>
