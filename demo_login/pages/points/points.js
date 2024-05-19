/**

 * 如有技术问题或商业合作，可以添加本人微信:Exixir99

 * @author 全黑科技

 * @Time 2021-06-16 21:49:01

 * @URL http://www.abtwork.com/

 */
var app = getApp()
const {get,post} = require('../../utils/request')
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
    userPoints:{},
    userInfo:{},
    pageNum:1,
    pageSize:10,
    total:0,
    active: 0,
    shopGiftList:[],
    giftRecordList:[],
    showExchangeConfirm: false,
    giftId:'',
    showDrawConfirm:false,
    giftRecordId:'',
  },

  closeDrawConfirm(){
    this.setData({
      giftRecordId:'',
      showDrawConfirm:false
    })
  },

  showDrawConfirm(event){
    this.setData({
      giftRecordId:event.currentTarget.dataset.giftrecordid,
      showDrawConfirm:true
    })
  },
  receiveGift(){
    console.log("this.data.giftRecordId",this.data.giftRecordId)
    post("/system/record/receive",{
      id:this.data.giftRecordId
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res)
      if (res.code===200) {
        wx.showModal({
          title: '提醒',
          content: '领取成功',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              
            }
          }
        })
      }
      this.refreshGiftRecordList();
      this.setData({
        showDrawConfirm:false
      })
    })
  },
  showExchangeConfirm(event){
    this.setData({
      giftId:event.currentTarget.dataset.giftid,
      showExchangeConfirm:true
    })
  },

  getUserPoints(){
    get("/system/record/points",{},{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res);
      this.setData({
        userPoints:res.data
      })
    })
  },

  closeExchangeConfirm(){
    this.setData({
      giftId:'',
      showExchangeConfirm:false
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserPoints();
    this.refreshGiftList();
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
    const index = event.detail.index;
    if (index===0) {
      console.log(index);
      this.refreshGiftList();
    }else{
      this.refreshGiftRecordList();
    }
    wx.pageScrollTo({
      selector:".top",
      duration: 300
    })
  },
  refreshGiftRecordList(){
    this.setData({
      pageNum:1,
      total:0,
      giftRecordList:[]
    })

    this.getGiftRecordList();
  },

  getGiftRecordList(){
    get("/system/record/unclaimedList",{
      pageNo:this.data.pageNum,
      pageSize:this.data.pageSize,
      status:0
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res);
      this.setData({
        giftRecordList:[...this.data.giftRecordList,...res.data.list],
        pageNum:++this.data.pageNum,
        total:res.data.total
      })
    })
  },

  refreshGiftList(){
    this.setData({
      shopGiftList:[],
      pageNum:1,
      total:0
    })
    this.getGiftList();
  },

  getGiftList(){
    get("/system/gift/list",{
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
      status:0
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res.rows);
      this.setData({
        pageNum:++this.data.pageNum,
        total:res.total,
        shopGiftList:[...this.data.shopGiftList,...res.rows]
      })
    })
  },
  showTips(){
    
      wx.showModal({
        title: 'Tips',
        content: '兑换的礼品可在当前校区体育馆负一楼领取！！！',
    
        complete: (res) => {
        }
      })
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

    get('/getInfo',{},{Authorization:wx.getStorageSync('Authorization')}).then(res=>{
      this.setData({
        userInfo:res.user
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
  

  /*
    兑换礼品
  */
  exchangeGift(){
    post("/system/record/exchange",{
      giftId:this.data.giftId
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      
      if (res.code===200) {
        wx.showToast({
          title: '兑换成功',
          icon:'none'
        })
        this.refreshGiftList();
        this.getUserPoints();
      }
      this.setData({
        showExchangeConfirm:false
      })
    })
  },

  showUserInfo(){
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