<template>
  <div class="xt-option">
    <div v-if="headShow" class="xt-option__hd">自定义表头</div>

  </div>
</template>

<script>
export default {
  name: 'XtOptions',
  props: {
    headShow: {
      default: true,
      type: Boolean
    },
  },
  data () {
    return {

    }
  },
  methods: {
    
  }
}
</script>

<style>

</style>