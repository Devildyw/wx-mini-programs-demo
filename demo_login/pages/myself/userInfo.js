/**

 * 如有技术问题或商业合作，可以添加本人微信:Exixir99

 * @author 全黑科技

 * @Time 2021-06-16 21:49:01

 * @URL http://www.abtwork.com/

 */
var app = getApp()
const {
  get,
  post
} = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: "",
    xh: "",
    isLogin: false,
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    is_bind: false,
    userInfo: {},
    editHidden: false,
    saveHidden: true,
    editControl: true,
    fileList: [],
    onAvatarShow:false,
    gridConfig: {
      column: 1,
      width: 300,
      height: 300,
    },
  },

  /*------------------------*/
  handleAdd(e) {
    const {
      fileList
    } = this.data;
    const {
      files
    } = e.detail;

    // 方法1：选择完所有图片之后，统一上传，因此选择完就直接展示
    this.setData({
      fileList: [...fileList, ...files], // 此时设置了 fileList 之后才会展示选择的图片
    });

    // 方法2：每次选择图片都上传，展示每次上传图片的进度
    // files.forEach(file => this.uploadFile(file))
  },

  onAvatarClose() {
    this.setData({ onAvatarShow:false });
  },
  onAvatarShow(){
    this.setData({
      onAvatarShow:true
    })
  },

  onUpload(file) {
    const {
      fileList
    } = this.data;

    this.setData({
      fileList: [...fileList, {
        ...file,
        status: 'loading'
      }],
    });
    const {
      length
    } = fileList;

    const task = wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: {
        user: 'test'
      },
      success: () => {
        this.setData({
          [`fileList[${length}].status`]: 'done',
        });
      },
    });
    task.onProgressUpdate((res) => {
      this.setData({
        [`fileList[${length}].percent`]: res.progress,
      });
    });
  },
  handleRemove(e) {
    const {
      index
    } = e.detail;
    const {
      fileList
    } = this.data;

    fileList.splice(index, 1);
    this.setData({
      fileList,
    });
  },
  /*-----------------------*/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("success")
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })

    that.setData({
      starCount: that.coutNum(that.data.starCount),
      forksCount: that.coutNum(that.data.forksCount),
      visitTotal: that.coutNum(that.data.visitTotal)
    })
    wx.hideLoading()
  },
  toLogin: function () {
    var type = "jwc"
    wx.navigateTo({
      url: '/pages/login/login?type=' + type,
    })
  },
  editInfo() {
    this.setData({
      editHidden: true,
      saveHidden: false,
      editControl: false
    })
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 250)
    wx.setNavigationBarTitle({
      title: "编辑资料"
    })
  },

  cancel() {
    this.setData({
      editHidden: false,
      saveHidden: true,
      editControl: true
    })
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 250)
    wx.setNavigationBarTitle({
      title: "个人信息"
    })
  },
  unLogin() {
    wx.showLoading({
      title: '解绑中...',
    })
    this.setData({
      is_bind: false
    })
    wx.setStorageSync('is_bind', false)
    wx.hideLoading()
  },
  get_my_num() {
    console.log("+===>")
    if (!this.data.is_bind) {
      this.setData({
        starCount: 0,
        visitTotal: 0,
        forksCount: 0
      })
    } else {
      this.setData({
        starCount: app.globalData.user_data.star_num,
        visitTotal: app.globalData.user_data.view_num,
        forksCount: app.globalData.user_data.comment_num
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let tem = wx.getStorageSync('is_bind');
    this.setData({
      isLogin: app.globalData.isLogin,
      xh: wx.getStorageSync('user'),
      is_bind: tem,
    })

    get('/getInfo', {}, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      this.setData({
        userInfo: res.user
      })
    })



    let ress = this.get_my_num()
  },
  go_my_share() {
    wx.navigateTo({
      url: './myContent',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  coutNum(e) {
    if (e > 1000 && e < 10000) {
      e = (e / 1000).toFixed(1) + 'k'
    }
    if (e > 10000) {
      e = (e / 10000).toFixed(1) + 'W'
    }
    return e
  },
  CopyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  showUserInfo() {
    wx.navigateTo({
      url: '/pages/myself/userInfo',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})