const {get,post} = require('../../utils/request')
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    password:'',
    code:'',
    title:"登录",
    imagePrefix:'data:image/png;base64,',
    image:'',
    uuid:'',
  },

  refreshCode(){
    get('/captchaImage',{},{Authorization:wx.getStorageSync('Authorization')}).then(res=>{
      this.setData({
        uuid:res.uuid,
        image:this.data.imagePrefix + res.img
      })
    })
  },

  login(){
    var that = this
        if (that.data.account == '') {
            wx.showModal({
                title: "提示",
                content: "请输入用户名",
                showCancel: false,
                success(res) {}
            })
        } else if (that.data.password == '') {
            wx.showModal({
                title: "提示",
                content: "请输入密码",
                showCancel: false,
                success(res) {}
            })
        }else if(that.data.code==''){
            wx.showModal({
              title: "提示",
              content: "请输入验证码",
              showCancel: false,
              success(res) {}
            })
        } else {
            wx.clearStorage()
            post('/login', {
                username: this.data.account,
                password: this.data.password,
                uuid: this.data.uuid,
                code: this.data.code
            }).then((data) => {
                wx.setStorageSync('Authorization', data.token)
                wx.switchTab({
                    url: '../index/index',
                })
            }).catch((err) => {
              this.refreshCode();
                wx.showToast({
                    title: 'Error!',
                    icon: 'error'
                })
                
            })
        }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // let token = null;
    // try {
    //     token = wx.getStorageSync('Authorization')
    // } catch (e) {
    //     console.log(e);
    // }
    // if (token) {
    //     wx.switchTab({
    //         url: '../index/index',
    //     })
    // }
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
    this.refreshCode();
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