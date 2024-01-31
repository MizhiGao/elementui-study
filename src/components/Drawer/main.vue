<template>
  <transition name="slide-fade" @after-enter="afterEnter">
    <div v-show="visible" class="drawer__wrapper">
      <div class="drawer__container">
        <div class="drawer__body">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// import Popup from "../../mixins/Popup";
// import Emitter from "../../mixins/Emitter.js";
export default {
  name: "MDrawer",
  // mixins: [Popup, Emitter],
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    // 遮罩层
    modal: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      closed: false,
    };
  },
  methods: {
    afterEnter() {
      this.$emit("afterEnter");
    },
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

.drawer__wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  height: 100%;
}
</style>
