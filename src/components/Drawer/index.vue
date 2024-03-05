<template>
  <transition name="slide-fade" @after-enter="afterEnter">
    <el-card  id="slide" ref="slide"  :style="{ 'z-index': zIndex }" class="el-card drawer__wrapper">
      <div>
        <i v-if="showClose" class="close-btn el-icon-close" @click="close" />
      </div>
      <slot />
    </el-card>
  </transition>
</template>

<script>
import Popup from "../../mixins/Popup";
import { getMaxIndex } from '@/utils/index'

export default {
  name: "MDrawer",
  mixins: [Popup],
  props: {
    showClose: {
      type: Boolean,
      default: true,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    // 遮罩层
    modal: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    /** 监听 点击事件(隐藏视图) */
    listenerIds: {
      type: Array,
      default:() => []
    },
    /** 阻挡 点击事件(隐藏视图) */
    noListenerIds: {
      type: Array,
      default: () => []
    },
    noListenerClass: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      zIndex: getMaxIndex(),
      closed: false, // to track if the drawer is closed
      prevActiveElement: null, // to store the previously focused element
      targetData: {
        isMoveClick: false,
        pageX: 0,
        pageY: 0
      },
    };
  },
  watch:{
    /**
     * The visible prop is watched, and when it changes,
     * the component emits events ('open', 'close', 'opened', 'closed')
     * and performs actions like appending to the body or focusing on the previously active element.
     */
    visible(val){
      if(val) {
        this.closed = false
        this.$emit('open')
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
        this.prevActiveElement = document.activeElement
      } else {
        if(!this.closed){
          this.$emit('close')
          if (this.destroyOnClose == true) {
            this.rendered = false
          }
        }
        this.$nextTick(()=>{
          if(this.prevActiveElement) {
            this.prevActiveElement.focus()
          }
        })
      }
    }
  },
  mounted() {
    if(this.visible) {
      this.rendered = true;
      this.open();
      if(this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }

    document.getElementById('app').addEventListener('click', this.handleDocumentClick, false)
    document.getElementById('app').addEventListener('mousedown', this.handleDocumentMousedown, false)
    document.getElementById('app').addEventListener('mouseup', this.handleDocumentMouseup, false)
  },
  beforeDestroy() {
    document.getElementById('app').removeEventListener('click', this.handleDocumentClick, false)
    document.getElementById('app').removeEventListener('mousedown', this.handleDocumentMousedown, false)
    document.getElementById('app').removeEventListener('mouseup', this.handleDocumentMouseup, false)
  },
  destroyed() {
    // console.log(this.appendToBody, this.$el,this.$el.parentNode);
    // if appendToBody is true, remove DOM node after destroy
    // if (this.appendToBody && this.$el && this.$el.parentNode) {
    //   this.$el.parentNode.removeChild(this.$el)
    // }
  },
  methods: {
    handleDocumentClick(e){
      if(this.targetData.isMoveClick) {
        this.targetData.isMoveClick = false
      } else {
          let hidden = true
          this.noListenerIds.forEach(element =>{
            let node = document.getElementById(element)
            if(node && node.contains(e.target)) {
              hidden = false
            }
          })
          this.noListenerClass.forEach(element =>{
            let items = document.getElementsByClassName(element)
            if(items && hidden) {
               for(let index = 0; index < items.length; index++) {
                  if(items[index].contains(e.target)){
                    hidden = false
                    break
                  }
                }
            }
          })
          const slideNode = document.getElementById('slide')
          if(slideNode && slideNode.contains(e.target)){
             hidden = false
          }
          if (hidden) {
            this.close()
          }
      }
    },
    handleDocumentMousedown(e){
      this.targetData.pageX = e.pageX
      this.targetData.pageY = e.pageY
    },
    handleDocumentMouseup(e){
      const isMouseMove = Math.abs(this.targetData.pageX - e.pageX) > 30 || Math.abs(this.targetData.pageY - e.pageY) > 30
      this.targetData.isMoveClick = isMouseMove
    },
     afterEnter() {
      this.$emit("afterEnter");
    },
    afterLeave() {
      console.log(1);
      // Handle the after-leave event
      this.$emit("afterLeave");
    },
    /**
     * @description 关闭抽屉弹出框
     */
    close(){
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  },
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  will-change: transform;
  transition: all 0.35s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100%);
}
.el-card {
  overflow: visible;
}
.drawer__wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  height: 100%;
}
.close-btn{
  position: absolute;
  right: 6px;
  top: 6px;
  padding: 4px;
  cursor: pointer;
}
</style>
