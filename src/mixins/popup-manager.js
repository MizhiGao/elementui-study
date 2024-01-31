import Vue from 'vue'
import { addClass, removeClass } from 'element-ui/src/utils/dom'

let hasModal = false
let hasInitZIndex = false
let zIndex // Manages the zIndex of modals, ensuring they appear in the correct order.

/**
 * @returns Returns the modal DOM element, creating it if it doesn't exist.
 */
const getModal = function() {
  if (Vue.prototype.$isServer) return
  let modalDom = PopupManager.modalDom
  if (modalDom) {
    hasModal = true
  } else {
    hasModal = false
    modalDom = document.createElement('div')
    PopupManager.modalDom = modalDom

    modalDom.addEventListener('touchmove', function(event) {
      event.preventDefault()
      event.stopPropagation()
    })

    modalDom.addEventListener('click', function() {
      PopupManager.doOnModalClick && PopupManager.doOnModalClick()
    })
  }

  return modalDom
}

const instances = {}

const PopupManager = {
  modalFade: true,
  /**
   * @returns Gets the instance of a registered popup by its ID.
   */
  getInstance: function(id) {
    return instances[id]
  },
  /**
   * Registers a new popup instance with a unique ID.
   */
  register: function(id, instance) {
    if (id && instance) {
      instances[id] = instance
    }
  },
  /**
   *
   *  Deregisters a popup instance by its ID.
   */
  deregister: function(id) {
    if (id) {
      instances[id] = null
      delete instances[id]
    }
  },
  /**
   * @returns Returns the next available zIndex for a modal.
   */
  nextZIndex: function() {
    return PopupManager.zIndex++
  },

  modalStack: [], // An array that keeps track of the currently open modals. It maintains information about each modal, such as its ID, zIndex, and modalClass.
  /**
   * @desc Closes the top modal if it has the closeOnClickModal property set to true.
   */
  doOnModalClick: function() {
    // console.log(PopupManager.modalStack)
    const topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1]
    if (!topItem) return

    const instance = PopupManager.getInstance(topItem.id)
    if (instance && instance.closeOnClickModal) {
      instance.close()
    }
  },
  /**
   * @desc Opens a modal with a specified ID, zIndex, DOM element, modalClass, and modalFade. It adds the modal to the modalStack.
   * @returns
   */
  openModal: function(id, zIndex, dom, modalClass, modalFade) {
    if (Vue.prototype.$isServer) return
    if (!id || zIndex === undefined) return
    this.modalFade = modalFade

    const modalStack = this.modalStack

    for (let i = 0, j = modalStack.length; i < j; i++) {
      const item = modalStack[i]
      if (item.id === id) {
        return
      }
    }

    const modalDom = getModal()

    addClass(modalDom, 'v-modal')
    if (this.modalFade && !hasModal) {
      addClass(modalDom, 'v-modal-enter')
    }
    if (modalClass) {
      const classArr = modalClass.trim().split(/\s+/)
      classArr.forEach(item => addClass(modalDom, item))
    }
    setTimeout(() => {
      removeClass(modalDom, 'v-modal-enter')
    }, 200)

    if (dom && dom.parentNode && dom.parentNode.nodeType !== 11) {
      dom.parentNode.appendChild(modalDom)
    } else {
      document.body.appendChild(modalDom)
    }

    if (zIndex) {
      modalDom.style.zIndex = zIndex
    }
    modalDom.tabIndex = 0
    modalDom.style.display = ''

    this.modalStack.push({ id: id, zIndex: zIndex, modalClass: modalClass })
  },
  /**
   *  Closes a modal with a specified ID and removes it from the modalStack.
   * @param {*} id
   */
  closeModal: function(id) {
    const modalStack = this.modalStack
    const modalDom = getModal()
    // console.log(modalStack, modalDom)
    if (modalStack.length > 0) {
      const topItem = modalStack[modalStack.length - 1]
      if (topItem.id === id) {
        if (topItem.modalClass) {
          const classArr = topItem.modalClass.trim().split(/\s+/)
          classArr.forEach(item => removeClass(modalDom, item))
        }

        modalStack.pop()
        if (modalStack.length > 0) {
          modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex
        }
      } else {
        for (let i = modalStack.length - 1; i >= 0; i--) {
          if (modalStack[i].id === id) {
            modalStack.splice(i, 1)
            break
          }
        }
      }
    }

    if (modalStack.length === 0) {
      if (this.modalFade) {
        addClass(modalDom, 'v-modal-leave')
      }
      setTimeout(() => {
        if (modalStack.length === 0) {
          if (modalDom.parentNode) modalDom.parentNode.removeChild(modalDom)
          modalDom.style.display = 'none'
          PopupManager.modalDom = undefined
        }
        removeClass(modalDom, 'v-modal-leave')
      }, 200)
    }
  }
}
/**
 * Initializes the zIndex value based on the Vue instance's configuration.
 */
Object.defineProperty(PopupManager, 'zIndex', {
  configurable: true,
  get() {
    if (!hasInitZIndex) {
      zIndex = zIndex || (Vue.prototype.$ELEMENT || {}).zIndex || 2000
      hasInitZIndex = true
    }
    return zIndex
  },
  set(value) {
    zIndex = value
  }
})

/**
 * @returns Retrieves the instance of the top modal in the stack.
 */
const getTopPopup = function() {
  if (Vue.prototype.$isServer) return
  if (PopupManager.modalStack.length > 0) {
    const topPopup = PopupManager.modalStack[PopupManager.modalStack.length - 1]
    if (!topPopup) return
    const instance = PopupManager.getInstance(topPopup.id)

    return instance
  }
}

// Listens for the 'keydown' event on the window and closes the top modal if the 'esc' key is pressed, and the top modal has closeOnPressEscape set to true.
if (!Vue.prototype.$isServer) {
  // handle `esc` key when the popup is shown
  window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27) {
      const topPopup = getTopPopup()

      if (topPopup && topPopup.closeOnPressEscape) {
        topPopup.handleClose
          ? topPopup.handleClose()
          : (topPopup.handleAction ? topPopup.handleAction('cancel') : topPopup.close())
      }
    }
  })
}

export default PopupManager
