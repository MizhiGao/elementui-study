<template>
  <div ref="reference" class="xt-select"
     @click="containerClick">
    <!-- 选中内容回显 -->
    <div ref="tags" class="xt-select__tags">
      <span v-for="item in showSelects" :key="item" class="select-item" >
        {{ item }}
        <i class="xt-delete-icon el-icon-close" @click.stop="deleteSelect(item)" />
      </span>
    <i v-if="selects.length > max && max > 0" class="el-icon-more" />
    <i :class="['el-icon-arrow-up', {'is-reverse': visible }]" />
    <div v-if="selects.length== 0" class="xt-placeholder">{{ placeholder }}</div>

    <!-- 选择框内容 -->
    <transition name="el-zoom-in-top" @before-enter="handleMenuEnter" @after-leave="doDestroy">
        <select-dropdown
          v-show="visible && !disabled"
          ref="popper"
          :append-to-body="popperAppendToBody">

        </select-dropdown>
    </transition>
    </div>
  </div>
</template>

<script>
import SelectDropdown from './src/SelectDropdown.vue'
export default {
  name: 'CustomSelect',
  components:{
    SelectDropdown,
  },
  props: {
    // 展示限制 0：展示全部
    max: {
      type: Number,
      default: 2
    },
    // 取值字段

    // 选择限制
    limit: Number,
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 自定义请求和参数
    request: Function,
    params: Object,
    disabled: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    }

  },
  data () {
    return {
      visible: false,
      dataValue: [], // 校准传入值
      loading: false,
      height: 34,

      optionsList: []
    }
  },
  computed: {
    // 实际展示的数据
    showSelects () {
      if (this.max && this.max > 0 && this.selects && this.selects.length > this.max) {
        return this.selects.slice(0, this.max)
      }
      return this.selects
    },
    selects () {
      if (!this.optionsList.length) {
        return []
      }

      return this.optionsList.filter(item => this.dataValue.includes(item[this.props.value]))
    }
  },
  watch: {

  },
  methods: {
    containerClick () {
      if (!this.disabled) {
        this.visible = true
      }
    },
    deleteSelect (item) {
      if (!item.disabled && this.disabled) {
        for (let index = 0; index < this.dataValue.length; index++) {
            console.log();
        }
      }
    },
    handleMenuEnter () {

    },
    doDestroy () {

    }
  }
}
</script>

<style scoped>
.xt-select{
  position: relative;
  width: 180px;
  height: 34px;
  border-radius: 4px;
  font-size: 13px;
  background: #fff;
  border: 1px solid #e6e6e6;
  color: #333;
  padding: 0 20px 0 5px;
  cursor: pointer;
}
.xt-select:hover{
  border-color: #c0c4cc;
}
.xt-placeholder{
  color: #ddd;
  line-height: 34px;
  cursor: pointer;
}
.el-icon-arrow-up{
  position: absolute;
  top: calc(50% - 7px);
  right: 5px;
  color: #c0c4cc;
  transition: transform .3s;
  transform: rotate(180deg);
  cursor: pointer;
}
.text-one-line {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>