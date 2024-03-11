export const on = (function () {
  //判断浏览器是否支持绑定事件监听器
  if (document.addEventListener) {
    // 如果支持返回一个函数，使用addEventListener 绑定事件
    return function (element, event, handler) {
      if (element, event, handler) {
        element.addEventListener(event,handler, false)
      }
    }
  } else {
    // 如果不支持，使用attachEvent绑定函数
    return function (element, event, handler) {
      if (element, event, handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()