import Vue from 'vue'
import Empty from './empty.vue'
import { addClass, removeClass, getStyle } from 'element-ui/src/utils/dom'

const EmptyMask = Vue.extend(Empty)
const emptyDirective = {}

emptyDirective.install = Vue => {
  if(Vue.prototype.$isServer) return
  const toggleEmpty = (el, binding) => {
    //首先判断值是否是数组，是的话判断数组长度 否则判断是否存在 当作boolean
    if ((Object.prototype.toString.call(binding.value) === '[object Array]' && binding.value.length === 0) || (Object.prototype.toString.call(binding.value) !== '[object Array]' && binding.value)) {
      Vue.nextTick(() => {
        el.xtEmptyOriginalPosition = getStyle(el, 'position')
        insertDom(el, el, binding)
      })
    } else { // 移除效果
      el.xtEmptyVisible = false
      removeClass(el, 'xt-empty-parent--relative')
      removeClass(el, 'xt-empty-parent--hidden')
      el.xtEmptyInstance.visible = false
    }
  }

  const insertDom = (parent, el) => {
    if (!el.xtEmptyVisible && getStyle(el, 'display') !== 'none' && getStyle(el, 'visibility') !== 'hidden') {
      console.log(el.xtEmptyMaskStyle)
      Object.keys(el.xtEmptyMaskStyle).forEach(property => {
        el.xtEmptyMask.style[property] = el.xtEmptyMaskStyle[property]
      })

      if (el.xtEmptyOriginalPosition !== 'absolute' && el.xtEmptyOriginalPosition !== 'fixed') {
        addClass(parent, 'xt-empty-parent--relative')
      }

      el.xtEmptyVisible = true
      parent.appendChild(el.xtEmptyMask)
      Vue.nextTick(() => {
        el.xtEmptyInstance.visible = true
      })
      el.xtEmptyInserted = true
    }
  }
  Vue.directive('empty', {
    bind: function (el, binding, vnode) {
      console.log(el, binding, vnode)
      const textExr = el.getAttribute('xt-empty-text')
      const iconExr = el.getAttribute('xt-empty-icon')
      const backgroundExr = el.getAttribute('xt-empty-background')
      const customClassExr = el.getAttribute('xt-empty-custom-class')
      const vm = vnode.context
      console.log(textExr, backgroundExr, vm)
      const mask = new EmptyMask({
        el: document.createElement('div'),
        data: {
          text: vm && vm[textExr] || textExr,
          icon: vm && vm[iconExr] || iconExr,
          background: vm && vm[backgroundExr] || backgroundExr,
          customClass: vm && vm[customClassExr] || customClassExr
        }
      })
      console.log(mask);
      el.xtEmptyInstance = mask
      el.xtEmptyMask = mask.$el
      el.xtEmptyMaskStyle = {}

      binding.value && toggleEmpty(el, binding)

    },

    update: function (el, binding) {
      el.xtEmptyInstance.setText(el.getAttribute('xt-empty-text'))
      el.xtEmptyInstance.setIcon(el.getAttribute('xt-empty-icon'))
      if (binding.oldValue !== binding.value) {
        toggleEmpty(el, binding)
      }
    },

    unbind: function (el, binding) {
      if (el.xtEmptyInserted) {
        el.xtEmptyMask && el.xtEmptyMask.parentNode && el.xtEmptyMask.parentNode.removeChild(el.xtEmptyMask)
        toggleEmpty(el, {
          value: false,
          modifiers: binding.modifiers
        })
      }
    }
  })
}

export default emptyDirective