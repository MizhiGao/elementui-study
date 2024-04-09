<template>
  <div class="xt-option">
    <div v-if="headShow" class="xt-option__hd">自定义表头</div>
    <div class="xt-option__bd">
      <div class="xt-option_search">
        <el-input v-model="searchInput" :disabled="disabled" placeholder="请搜索" size="small"
        prefix-icon="el-icon-search" class="search-input" />
      </div>
      <div class="search-list">
        <el-checkbox
          :indeterminate="isIndeterminate"
          :disabled="disabled"
          v-model="checkAll"
          class="all-check"
          @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group
          ref="checkboxGroup"
          v-model="dataValue"
          :max="max"
          :disabled="disabled"
          @change="checkboxChange">
            <el-checkbox
              v-for="(item, i) in showOptions"
              :key="i"
              :label="item[props.value]">
              <span>{{ item[props.label] }}</span>
            </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="xt-option__ft">
      <span class="select-info">已选择<span class="select-info--num">{{ value ? value.length : 0 }}</span>项</span>
      <el-button type="text" @click="clearAll">清空</el-button>
    </div>
  </div>
</template>

<script>
import { objDeepCopy, valueEquals } from '@/utils'
export default {
  name: 'XtOptions',
  props: {
    headShow: {
      default: true,
      type: Boolean
    },
    options: Array,
    value: Array,
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
    max: Number,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataValue: [],
      searchInput: '',
      checkAll: false,
      isIndeterminate: false
    }
  },
  computed: {
    showOptions() {
      return this.options.filter(item => {
        return !item.isHide
          // && PinyinMatch.match(item[this.props.label], this.searchInput)
      })
    }
  },
  watch: {
    value() {
      if (this.options) {
        const optionsLength = this.options.filter(item => !item.isHide).length
        const isCheckAll = this.value.length === optionsLength && (this.value.length > 0 || optionsLength > 0)
        this.checkAll = isCheckAll
        this.isIndeterminate = !this.checkAll && this.value.length > 0
      }
      if (!valueEquals(this.value, this.dataValue)){
        this.dataValue = objDeepCopy(this.value)
      }
    }
  },
  created () {
    this.dataValue = objDeepCopy(this.value || [])
  },
  methods: {
    /**勾选 */
    checkboxChange (val) {
      console.log(val);
      this.$emit('input', val)
      this.$emit('change')
    },
    /**全选 */
    handleCheckAllChange (val) {
      if (val) {
        const ids = []
        this.options.forEach(item => {
          if (!item.isHide) {
            ids.push(item[this.props.value])
          }
        })
        this.$emit('input', ids)
        this.$emit('change')
      } else {
        this.$emit('input', [])
        this.$emit('change')
      }

    },
    /**清空 */
    clearAll() {
      this.$emit('input', [])
    }
  }
}
</script>

<style scoped>
.xt-option__hd{
  padding: 0 16px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #e6e6e6;
}
.xt-option__bd {
  padding: 10px 12px;
}
.xt-option__ft {
  padding: 4px 12px;
  background: #f7f8fa;
  border-top: 1px solid #e6e6e6;
}

/deep/.el-checkbox{
  display: block;
  padding: 5px 0;
  margin-left:0;
}
</style>