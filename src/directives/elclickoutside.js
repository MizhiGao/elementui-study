import Vue from 'vue'
import { on } from '@/utils/dom'

const nodeList = [] // 存储绑定了该指令的元素
const ctx = '@@xtclickoutsideContext' // 指令的上下文标识

let startClick // 记录鼠标按下的事件
let seed = 0 // 生成节点的唯一标识

// 绑定了一个 mousedown 事件，用于记录鼠标按下的位置。
!Vue.prototype.$isServer && on(document, 'mousedown', e => startClick = e) // 绑定 mousedown 事件

//用于检查点击的位置是否在指令绑定的元素外部，并调用相应的处理函数。
!Vue.prototype.$isServer && on(document, 'mouseup', e => {
  nodeList.forEach(node =>node[ctx].documentHandler(e, startClick))
})

//
/**
 *
 * @param {*} el 指令绑定的元素
 * @param {*} binding 指令的绑定信息
 * @param {*} vnode Vue 虚拟节点
 * @description 工厂函数 用于生成处理document事件的函数
 * @returns
 */
function createDocumentHandler (el, binding, vnode) {
  // 该函数有两个参数 mouseup 和 mousedown，它们用于存储鼠标抬起和鼠标按下事件的相关信息，默认为空对象。
  return function (mouseup = {}, mousedown = {}) {
    // 检查点击位置是否在指令绑定的元素外部，并执行相应的逻辑
    // 是否在指定元素关联的 vnode.context.popperElm 内部
    if (!vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm && (
        vnode.context.popperElm.contains(mouseup.target) ||
        vnode.context.popperElm.contains(mousedown.target)))) {
      return
    }

    if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
      //如果指令绑定了表达式 binding.expression 并且指定元素上存储了方法名 el[ctx].methodName，则调用 Vue 实例中的对应方法 vnode.context[el[ctx].methodName]()。
      vnode.context[el[ctx].methodName]()
    } else {
      // 否则，执行指令绑定的值 binding.value，即指令绑定的回调函数
      el[ctx].bindingFn && el[ctx].bindingFn()
    }


  }
}

export default {
  bind (el, binding, vnode) {
    console.log(el, binding, vnode);
    nodeList.push(el)
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    }
  },
  update (el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].methodName = binding.expression
    el[ctx].bindingFn = binding.value
  },
  unbind (el) {
    const len = nodeList.length
    for (let i = 0; i < len; i++){
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete el[ctx]
  }
}