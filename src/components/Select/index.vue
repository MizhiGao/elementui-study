<template>
  <div v-elclickoutside="handleClose" ref="reference" class="xt-select"
     @click="containerClick">
    <!-- 选中内容回显 -->
    <div ref="tags" class="xt-select__tags">
      <span v-for="item in showSelects" :key="item[props.value]" class="select-item" >
        {{ item[props.label] }}
        <i class="xt-delete-icon el-icon-close" @click.stop="deleteSelect(item)" />
      </span>
    </div>
    <i v-if="selects.length > max && max > 0" class="el-icon-more" />
    <i :class="['el-icon-arrow-up', {'is-reverse': visible }]" />

    <div v-if="selects.length== 0" class="xt-placeholder">{{ placeholder }}</div>

    <!-- 选择框内容 -->
    <transition name="el-zoom-in-top" @before-enter="handleMenuEnter" @after-leave="doDestroy">
      <select-dropdown
      v-show="visible && !disabled"
      ref="popper"
      :append-to-body="popperAppendToBody">
        <el-scrollbar  ref="scrollbar"
          tag="div">
            <xt-options
              v-loading="loading"
              v-model="dataValue"
              :disabled="disabled"
              :options="optionsList"
              :props="props"
              :header-show="headerShow"
              :max="limit"
              @change="selectChange"
              @close="visible = false" />
        </el-scrollbar>
      </select-dropdown>
    </transition>
  </div>
</template>

<script>
import elclickoutside from '../../directives/elclickoutside'
import SelectDropdown from './src/SelectDropdown.vue'
import XtOptions from './src/XtOptions.vue'
import Emitter from '@/mixins/Emitter'
export default {
  name: 'CustomSelect',
  components:{
    SelectDropdown,
    XtOptions,
  },
  directives: {
    elclickoutside,
  },
  mixins: [Emitter],
  props: {
    // 展示限制 0：展示全部
    max: {
      type: Number,
      default: 2
    },
    // 取值字段
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id',
          label: 'realname'
        }
      }
    },
    headerShow: {
      type: Boolean,
      default: true
    },
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
    visible (val) {
      if (val) {
        this.broadcast('SelectDropdown', 'updatePopper')
      } else {
        this.broadcast('SelectDropdown', 'destroyPopper')
      }
      this.$emit('visible-change', val)
    },
    options: {
      handler() {
        this.verifyOptions()
      },
      immediate: true
    },
    showSelects: {
      handler() {
        this.resetHeight()
      },
      immediate: true
    }
  },
  methods: {
    containerClick () {
      if (!this.disabled) {
        this.visible = true
      }
    },
    resetHeight () {
      const tags = this.$refs.tags
      if (tags) {
        this.$nextTick(() => {
          this.height = tags.clientHeight > 34 ? tags.clientHeight + 6 : 34
        })
      } else {
        this.height = 34
      }
    },
    deleteSelect (item) {
      console.log(this.dataValue)
      if (!item.disabled && !this.disabled) {
        console.log(this.dataValue)
        for (let index = 0; index < this.dataValue.length; index++) {
          const id = this.dataValue[index]
          if (id == item[this.props.value]) {
            this.dataValue.splice(index, 1)
            break
          }
        }
      }
    },
    verifyOptions () {
      if (!this.options) {
        this.requestList()
      } else {
        this.optionsList = this.options
      }
    },
    requestList () {
      this.loading = true
      let request = null
      let params = null
      if(this.request) {
          request = this.request
      }
      if (this.params) {
        params = this.params
      }
      request(params)
        .then(res => {
          console.log(res)
          this.optionsList = Object.hasOwnProperty.call(res.data, 'list') ? (res.data.list || []) : (res.data || [])
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleClose() {
      this.visible = false
    },
    handleMenuEnter () {

    },
    selectChange () {

    },
    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy()
    },
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
.el-icon-more{
  position: absolute;
  top: 5px;
  right: 20px;
  padding: 6px 10px;
  font-size: 12px;
  background: #f3f7ff;
  color: #666;
  border-radius: 4px;
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
.el-icon-arrow-up.is-reverse{
  transform: rotate(0deg);
}
.xt-select__tags{
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.select-item{
  position: relative;
  max-width: 80px;
  border-radius: 4px;
  background: #f3f7ff;
  padding: 5px 20px 5px 8px;
  margin: 3px;
}
.xt-delete-icon{
  color: #999;
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 4px;
}
.text-one-line {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>