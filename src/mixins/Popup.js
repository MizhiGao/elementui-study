// This code defines a Vue.js mixin that can be used to create modal components.
// The mixin manages the visibility, opening, and closing of modals, as well as handling related features such as modals with a backdrop(modal), scroll locking, and keyboard event listeners.
import Vue from 'vue'
import merge from 'element-ui/src/utils/merge'
import PopupManager from './popup-manager'
// import getScrollBarWidth from '../scrollbar-width'
// import { getStyle, addClass, removeClass, hasClass } from './dom'

let idSeed = 1

// let scrollBarWidth

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    openDelay: {},
    closeDelay: {},
    // zIndex: {},
    modal: {
      type: Boolean,
      default: false
    },
    modalFade: {
      // control whether a fade effect is applied to the modal when it is opened.
      // The purpose of the modalFade option is to determine whether or not to add a fade transition when the modal is displayed.
      type: Boolean,
      default: true
    },
    modalClass: {},
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  },
  // Registers the modal component with PopupManager when it's about to be mounted.
  beforeMount() {
    this._popupId = 'popup-' + idSeed++
    // console.log('beforeMount', this._popupId)
    PopupManager.register(this._popupId, this)
  },
  // Deregisters the modal component and closes it before it's destroyed. It also restores the body style.
  beforeDestroy() {
    // console.log('beforeDestroy', this._popupId)
    PopupManager.deregister(this._popupId)
    PopupManager.closeModal(this._popupId)

    this.restoreBodyStyle()
  },

  data() {
    return {
      opened: false,
      bodyPaddingRight: null,
      computedBodyPaddingRight: 0,
      withoutHiddenClass: true,
      rendered: false // The rendered variable is a boolean flag used to track whether the component has been rendered or not.
      // _opening: The _opening variable is a boolean flag used to indicate whether the process of opening the drawer is in progress.
    }
  },
  watch: {
    // Watches changes to the visible property and triggers the open or close methods accordingly.
    visible(val) {
      console.log(val)
      if (val) {
        if (this._opening) return
        if (!this.rendered) {
          this.rendered = true
          Vue.nextTick(() => {
            this.open()
          })
        } else {
          this.open()
        }
      } else {
        this.close()
      }
    }
  },

  methods: {
    /**
     * Opens the modal, taking into account an optional options parameter.
     * @param {*} options
     */
    open(options) {
      if (!this.rendered) {
        this.rendered = true
      }

      const props = merge({}, this.$props || this, options)

      if (this._closeTimer) {
        clearTimeout(this._closeTimer)
        this._closeTimer = null
      }
      clearTimeout(this._openTimer)

      const openDelay = Number(props.openDelay)
      if (openDelay > 0) {
        this._openTimer = setTimeout(() => {
          this._openTimer = null
          this.doOpen(props)
        }, openDelay)
      } else {
        console.log(props);
        this.doOpen(props)
      }
    },
    /**
     * Performs the actual opening of the modal, setting styles, managing scroll lock, and updating the opened flag.
     * @param {*} props
     * @returns
     */
    doOpen(props) {
      if (this.$isServer) return
      if (this.willOpen && !this.willOpen()) return
      if (this.opened) return

      this._opening = true

      const dom = this.$el

      const modal = props.modal

      const zIndex = this.zIndex
      if (zIndex) {
        PopupManager.zIndex = zIndex
      }
     console.log(modal, dom, zIndex)
      if (modal) {
        if (this._closing) {
          PopupManager.closeModal(this._popupId)
          this._closing = false
        }
        PopupManager.openModal(this._popupId, PopupManager.nextZIndex(), this.modalAppendToBody ? undefined : dom, props.modalClass, props.modalFade)
        // if (props.lockScroll) {
        //   this.withoutHiddenClass = !hasClass(document.body, 'el-popup-parent--hidden')
        //   if (this.withoutHiddenClass) {
        //     this.bodyPaddingRight = document.body.style.paddingRight
        //     this.computedBodyPaddingRight = parseInt(getStyle(document.body, 'paddingRight'), 10)
        //   }
        //   // scrollBarWidth = getScrollBarWidth()
        //   const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight
        //   const bodyOverflowY = getStyle(document.body, 'overflowY')
        //   if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll') && this.withoutHiddenClass) {
        //     document.body.style.paddingRight = this.computedBodyPaddingRight + scrollBarWidth + 'px'
        //   }
        //   addClass(document.body, 'el-popup-parent--hidden')
        // }
      }

      if (getComputedStyle(dom).position === 'static') {
        dom.style.position = 'absolute'
      }

      dom.style.zIndex = PopupManager.nextZIndex()
      this.opened = true
      // console.log(dom, dom.style.zIndex, modal)
      this.onOpen && this.onOpen()

      this.doAfterOpen()
    },
    /**
     *  Executes any additional logic after the modal is opened
     */
    doAfterOpen() {
      this._opening = false // It is set to false in the doAfterOpen method, which is called after the drawer has been successfully opened.
    },
    /**
     *  Closes the modal, taking into account a specified delay.
     * @returns
     */
    close() {
      if (this.willClose && !this.willClose()) return

      if (this._openTimer !== null) {
        clearTimeout(this._openTimer)
        this._openTimer = null
      }
      clearTimeout(this._closeTimer)

      const closeDelay = Number(this.closeDelay)

      if (closeDelay > 0) {
        this._closeTimer = setTimeout(() => {
          this._closeTimer = null
          this.doClose()
        }, closeDelay)
      } else {
        this.doClose()
      }
    },
    /**
     * Performs the actual closing of the modal and triggers the onClose callback.
     */
    doClose() {
      this._closing = true

      this.onClose && this.onClose()

      if (this.lockScroll) {
        setTimeout(this.restoreBodyStyle, 200)
      }

      this.opened = false

      this.doAfterClose()
    },
    /**
     *  Executes any additional logic after the modal is closed.
     */
    doAfterClose() {
      PopupManager.closeModal(this._popupId)
      this._closing = false
    },
    /**
     * Restores the body style when the modal is closed, including scroll-related styles.
     */
    restoreBodyStyle() {
      if (this.modal && this.withoutHiddenClass) {
        document.body.style.paddingRight = this.bodyPaddingRight
        // removeClass(document.body, 'el-popup-parent--hidden')
      }
      this.withoutHiddenClass = true
    }
  }
}

export {
  PopupManager
}
