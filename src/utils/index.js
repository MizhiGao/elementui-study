/** 获取最大 z-index 的值 */
import {
  PopupManager
} from 'element-ui/lib/utils/popup'
export function getMaxIndex() {
  return PopupManager.nextZIndex()
}


// 深拷贝
export const objDeepCopy = (obj) => {
  if (typeof obj !== 'object' || obj == null) {
    throw new TypeError('传入的参数不是对象')
  }
  let newData = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    // 确保属性属于对象本身，不拷贝原型链上的属性
    if (Object.hasOwnProperty.call(obj, key)) {
      if (obj[key] && typeof obj[key] == 'object') {
        newData[key] = objDeepCopy(obj[key])
      } else {
        newData[key] = obj[key]
      }
    }
  }
  return newData
}

export const valueEquals = (a, b) => {
  // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true;
  if (!(a instanceof Array)) return false;
  if (!(b instanceof Array)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};