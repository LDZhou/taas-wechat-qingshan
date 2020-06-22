
const app = getApp()
App.Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    confirmText: {
      type: String,
      value: ''
    },
    iconPath: {
      type: String,
      value: ''
    },
    showClose: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hide() {
      this.setData({
        showModal: false
      }, () => { this.triggerEvent('hideModel') })
    },

    confirmModel() {
      this.triggerEvent('confirmModel')
    },

    modelClose() {
      this.triggerEvent('modelClose')
    },

    show() {
      this.setData({
        showModal: true
      })
    }
  }
})
