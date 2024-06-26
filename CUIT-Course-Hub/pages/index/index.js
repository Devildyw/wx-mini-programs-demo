const imageCdn = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images';
const swiperList = [
  `${imageCdn}/3961622281214_.pic_hd.jpg`,
  `${imageCdn}/课堂 (1).png`,
  `${imageCdn}/图书馆.png`,
];

const {
  get,
  post
} = require('../../utils/request')

Page({



  /**
   * 页面的初始数据
   */
  data: {
    title: "登录",
    times: [
      "08:30-10:00",
      "10:15-11:45",
      "14:30-16:00",
      "16:15-17:45",
      "19:00-20:30",
    ],
    hotCourseList: [],
    keyword: '',
    current: 0,
    autoplay: false,
    duration: 500,
    interval: 5000,
    swiperList,
    user_data: {},
    isLogin: false,
    navs: [{
        key: "timetable",
        desc: "课表",
        verify: "jwc"
      },
      {
        key: "tips",
        desc: "小贴士",
        verify: "jwc"
      },
      {
        key: "selectCourse",
        desc: "选课",
        verify: ""
      },
      {
        key: "points",
        desc: "积分",
        verify: "jwc"
      }
    ],
    is_bind: '',
    notice: '',
    userInfo: '',
  },

  confirmTap(e) {
    console.log('确认事件', e.detail);
  },

  onChange(e) {
    const {
      detail: {
        current,
        source
      },
    } = e;
    console.log(current, source);
  },
  //轮播图的切换事件
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //轮播图点击事件
  swipclick: function (e) {
    console.log(this.data.swiperCurrent)
  },
  showMore() {
    wx.navigateTo({
      url: '/pages/selectCourse/selectCourse',
    })
  },
  getNotice() {
    get('/system/notice/new', {}, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      console.log(res)
      this.setData({
        notice: res.data.noticeTitle,
      })
    })
  },

  onInput(e) {
    this.setData({
      keyword: e.detail
    })
  },
  submit(e) {
    var key = e.detail.target.dataset.key //要去的地方。
    // var verify = e.detail.target.dataset.verify; //需要的权限
    var content = ""
    var url = ""


    if (key === 'timetable') {
      wx.switchTab({
        url: '/pages/' + key + "/" + key,
        fail: function () {
          wx.showToast({
            title: '即将开放',
            icon: 'none'
          })
        }
      })
    } else if (key === 'tips') {
      wx.showModal({
        title: '这是一条小贴士',
        content: '内容',
        complete: (res) => {
          if (res.cancel) {

          }

          if (res.confirm) {

          }
        }
      })
    } else if(key === 'points'){
      wx.navigateTo({
        url: '/points/pages/points/points',
        fail: function () {
          wx.showToast({
            title: '即将开放',
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/' + key + "/" + key,
        fail: function () {
          wx.showToast({
            title: '即将开放',
            icon: 'none'
          })
        }
      })
    }
  },
  onSearch() {
    wx.navigateTo({
      url: '/pages/selectCourse/selectCourse?keyword=' + this.data.keyword,
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.share_detail.images // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getHotCourseList() {
    get("/system/course/hot/list", {}, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      this.setData({
        hotCourseList: res.data
      })

    })
  },

  showNotice() {
    wx.showModal({
      title: '公告通知',
      content: this.data.notice,
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {

        }
      }
    })
  },

  showCourseDetail(event) {
    let tcourseId = event.currentTarget.dataset.teachercourseid;
    wx.navigateTo({
      url: '/pages/selectCourse/courseDetailInfo?tcourseId=' + tcourseId,
    })
  },


  navigatetokb: function () {
    wx.switchTab({
      url: '/pages/timetable/timetable',
    })
  },

  auth: function (e) {
    console.log(e)
    var type = "jwc"
    wx.clearStorage();
    wx.navigateTo({
      url: '/pages/login/login',
    })
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
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.getData()
    this.getNotice()
    this.getHotCourseList()

    if (this.data.userInfo.roles[0].roleKey == 'teacher') {
      this.setData({
        navs: this.data.navs.slice(0, 2)
      })
    }
  },

  getData() {
    this.setData({
      is_bind: wx.getStorageSync('Authorization') != null,
      isLogin: wx.getStorageSync('Authorization') != null
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

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})