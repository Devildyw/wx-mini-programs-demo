import drawQrcode from '../../utils/weapp.qrcode.esm.js'
const {
  get, post
} = require("../../utils/request")

// pages/material/materialDetailInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    materialid: '',
    materialDetailInfo: {},
    swiperList: [],
    onMaterialAddMarkShow:false,
    rate:0
  },
  onRateChange(e) {
    this.setData({
      rate: e.detail.value
    });
  },

  addMaterialMark(){
    post("/system/material/evaluate",{
      materialId:this.data.materialid,
      mark:this.data.rate
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      if (res.code===200) {
        wx.showModal({
          title: '提示',
          content: '评分成功',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              
            }
          }
        })
      }
      this.getCourseMaterialInfo();
      this.setData({
        rate:0,
        onMaterialAddMarkShow:false,
      })
    })
  },
  onMaterialAddMarkClose() {
    this.setData({
      onMaterialAddMarkShow: false
    });
  },
  onMaterialAddMarkShow() {
    this.setData({
      onMaterialAddMarkShow: true
    })
  },

  downloadMaterialFile() {
    wx.navigateTo({
      url: '/pages/material/material?url='+this.data.materialDetailInfo.url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.materialid);
    this.setData({
      materialid:options.materialid
    })
    
    this.getCourseMaterialInfo();
  },

  getCourseMaterialInfo() {
    get("/system/material/material/info", {
      materialId: this.data.materialid
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      console.log(res);
      this.setData({
        swiperList: [res.data.coverUrl],
        materialDetailInfo: res.data
      })
    })
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