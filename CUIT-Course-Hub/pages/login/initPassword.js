const {
  get,
  post
} = require('../../utils/request')
const fail = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E5%A4%B1%E8%B4%A5%E7%8A%B6%E6%80%81.png'
const success = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E7%8A%B6%E6%80%81-%E6%88%90%E5%8A%9F_%E7%8A%B6%E6%80%81-%E6%88%90%E5%8A%9F.png'
const def = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E9%BB%98%E8%AE%A4%E7%8A%B6%E6%80%81.png'
var re = new RegExp("^(?=.*[a-zA-Z])(?=.*\\d).{8,16}$");
// pages/login/initPassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    statusConfirmPwdImage: def,
    statusNewPwdImage: def,
    isCheckConfirmPwd: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let token = wx.getStorageSync('Authorization')
    if (token==null ||token==='') {
      wx.reLaunch({url: "/pages/login/login"});
    }
  },
  editNewPwd(event) {
    if (event.detail.value !== '') {

      if (re.test(event.detail.value)) {
        this.setData({
          newPassword: event.detail.value,
          statusNewPwdImage: success,
          isCheckConfirmPwd: false
        })
      } else {
        this.setData({
          statusNewPwdImage: fail,
          isCheckConfirmPwd: true
        })
      }
    } else {
      this.setData({
        statusNewPwdImage: def,
        isCheckConfirmPwd: true,
        confirmPassword: ''
      })
    }
  },
  onConfirmPwd(event) {
    if (event.detail.value !== '') {
      if (this.data.newPassword === event.detail.value) {
        this.setData({
          statusConfirmPwdImage: success,
          confirmPassword: event.detail.value
        })
      } else {
        this.setData({
          statusConfirmPwdImage: fail
        })
      }
    } else {
      this.setData({
        statusConfirmPwdImage: def
      })
    }
  },

  initPassword() {
    if (this.data.oldPassword === '') {
      wx.showModal({
        title: '错误',
        content: '旧密码为空',
        showCancel:false,
        complete: (res) => {
          if (res.confirm) {

          }
        }
      })
    } else if (this.data.newPassword === '') {
      wx.showModal({
        title: '错误',
        content: '新密码为空',
        showCancel:false,
        complete: (res) => {
          if (res.confirm) {

          }
        }
      })
    } else if (!re.test(this.data.newPassword)) {
      wx.showModal({
        title: '错误',
        content: '新密码格式错误，新密码要求包含数字和字母，8-16位',
        showCancel:false,
        complete: (res) => {
          if (res.confirm) {

          }
        }
      })
    } else if (this.data.confirmPassword === '') {
      wx.showModal({
        title: '错误',
        content: '确认密码为空',
        showCancel:false,
        complete: (res) => {
          if (res.confirm) {

          }
        }
      })
    } else if (this.data.confirmPassword !== this.data.newPassword) {
      wx.showModal({
        title: '错误',
        content: '确认密码为空',
        showCancel:false,
        complete: (res) => {
          if (res.confirm) {

          }
        }
      })
    }else{
      //参数校验无误发送请求
    post("/initPassword", {
      oldPassword:this.data.oldPassword,
      newPassword:this.data.newPassword,
      confirmPassword:this.data.confirmPassword
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then((data) => {
      if (data.code===200) {
        console.log(data);
        //清空缓存
        wx.clearStorageSync()
        wx.showModal({
          title: '更新密码成功',
          content: '点击跳转到登录页',
          showCancel:false,
          complete: (res) => {
            if (res.confirm) {
              wx.reLaunch({url: "/pages/login/login"});
            }
          }
        })
        
      }else {
        wx.showToast({
          title: data.msg,
          icon: 'error'
        })
      }
    }).catch((err) => {
      wx.showToast({
        title: '更新密码失败',
        icon: 'error'
      })

    })
    }

    

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})