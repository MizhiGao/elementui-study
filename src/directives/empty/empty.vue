<template>
  <div v-show="visible" :style="{ backgroundColor: background || '' }" :class="[customClass]" class="empty-mask">
    <div class="empty-content">
      <img v-if="iconUrl" :src="iconUrl" class="empty-icon" />
      <p v-if="showText" class="empty-text">{{ showText }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: null,
      background: null,
      visible: false,
      icon: null,
      customClass: ''
    }
  },
  computed: {
    iconUrl: function () {
      if (this.icon) {
        if (this.icon === 'none') {
          return ''
        } else if (this.icon === 'nopermission') {
          return require('@/assets/img/nopermission.svg')
        } else {
          return require('@/assets/img/empty.png')
        }
      } else {
        return require('@/assets/img/empty.png')
      }
    },
    showText: function() {
      if (this.text) {
        return this.text
      } else {
        return '没有找到数据'
      }
    }
  },
  methods: {
    setText(text) {
      this.text = text
    },
    setIcon(icon) {
      this.icon = icon
    }
  }
}
</script>

<style>
.empty-mask{
  position: absolute;
  z-index: 5;
  background-color: rgba(255,255,255, 0.98) ;
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.empty-content {
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  text-align: center;
  position: absolute;
}
.empty-text {
  margin: 3px 0;
  color: #aaa;
  font-size: 13px;
}
.empty-icon {
  display: block;
  width: 150px;
  margin: 0 auto 20px auto;
}
</style>