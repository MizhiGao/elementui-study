<template>
  <div :class="[popperClass]" :style="{minWidth:minWidth}" class="xt-select-dropdown xt-popper">
    <slot />
  </div>
</template>

<script>
import Popper from 'element-ui/lib/utils/vue-popper'

export default {
  name: 'SelectDropdown',
  mixins: [Popper],
  props: {
  },
  data () {
    return {
      minWidth: '300px'
    }
  },
  computed: {
    popperClass() {
      return this.$parent.popperClass
    }
  },
  mounted(){
      console.log(this.$parent.$el, this.$el)
  }

}
</script>

<style>
.xt-select-dropdown {
  position: absolute;
  z-index: 1001;
  border: solid 1px #E4E7ED;
  border-radius: 4px;
  background-color: #FFFFFF;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 5px 0;
}
</style>