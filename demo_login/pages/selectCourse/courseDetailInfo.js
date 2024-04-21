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
const imageCdn = 'https://tdesign.gtimg.com/mobile/demos';
const swiperList = [
  `${imageCdn}/swiper1.png`,
  `${imageCdn}/swiper2.png`,
  `${imageCdn}/swiper1.png`,
  `${imageCdn}/swiper2.png`,
  `${imageCdn}/swiper1.png`,
  '/images/3961622281214_.pic_hd.jpg',
];
const likedImage = '../../assets/icon/点赞图标.png';
const unLikedImage = '../../assets/icon/未点赞图标.png';
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
    active: 2,
    current: 1,
    autoplay: true,
    duration: 500,
    interval: 5000,
    swiperList,
    navigation: {
      type: '',
      showControls: true
    },
    value: 3,
    // 资料
    materialList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    materialType: {
      value: 'all',
      options: [{
          value: 'all',
          label: '类别',
        },
        {
          value: 'new',
          label: '最新产品',
        },
        {
          value: 'hot',
          label: '最火产品',
        },
      ],
    },
    sorter: {
      value: 'default',
      options: [{
          value: 'default',
          label: '默认排序',
        },
        {
          value: 'markHigh',
          label: '按评分降序排序',
        },
        {
          value: 'personNumHigh',
          label: '按评分人数降序排序',
        },
        {
          value: 'personNumHigh',
          label: '按选择人数降序排序',
        },
      ],
    },
    likeImage: unLikedImage,
    evaluateSorter: {
      value: 'default',
      options: [{
          value: 'default',
          label: '默认排序',
        },
        {
          value: 'markHigh',
          label: '按评分降序排序',
        },
        {
          value: 'personNumHigh',
          label: '按评分人数降序排序',
        },
        {
          value: 'personNumHigh',
          label: '按选择人数降序排序',
        },
      ],
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.swiperList);
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
  unLogin() {
    wx.showLoading({
      title: '解绑中...',
    })
    this.setData({
      is_bind: false
    })
    wx.setStorageSync('is_bind', false)
    wx.hideLoading()
    //云函数中将用户记录的状态表示设置为解绑状态，同时本地更新绑定缓存

    // wx.cloud.callFunction({
    //   name: 'user',
    //   data: {
    //     action: 'un_bind'
    //   }
    // }).then(res => {
    //   console.log(res);
    //   wx.hideLoading()
    //   //app.globalData.is_bind = false;

    // }).catch(err => {
    //   wx.hideLoading()
    // })
  },

  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.index + 1}`,
      icon: 'none'
    });
    wx.pageScrollTo({
      selector:".top",
      duration: 300
    })
  },
  handlerBackTop(e) {
    wx.pageScrollTo({
      selector:".top",
      duration: 300
    })
  },
  onPickerChange() {

  },

  handleClick(e){
    console.log(123456);
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


    //下边是获取用户数据的云函数，同样根据学校自行定义,仅提供思路
    //如果用户没有绑定就按0算

    // wx.cloud.callFunction({
    //   name: 'user',
    //   data: {
    //     action: 'my_data'
    //   }
    // }).then(res => {
    //   if(res.result===null){
    //     this.setData({
    //       starCount: 0,
    //       visitTotal: 0,
    //       forksCount: 0
    //     })
    //   }else{
    //     this.setData({
    //       starCount: res.result.star_num,
    //       visitTotal: res.result.view_num,
    //       forksCount: res.result.comment_num
    //     })
    //   }
    //   console.log(res);
    // })
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