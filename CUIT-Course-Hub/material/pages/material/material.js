const {get,post} = require('../../../utils/request')
import drawQrcode from 'weapp-qrcode'
// 或者，将 dist 目录下，weapp.qrcode.min.js 复制到项目目录中
// import drawQrcode from '../../utils/weapp.qrcode.min.js'


// pages/selectCourse/selectCourse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
  },


  onChange(e) {
    this.setData({
      'type.value': e.detail.value,
    });
  },

  onCourseTypeChange(e){
    this.setData({
      'courseType.value': e.detail.value,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      url:options.url
    })
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: this.data.url
    })
  },
  copyUrl(){
    wx.setClipboardData({
      data: this.data.url,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  getList(){
    get('/system/originMaterial/page/list',{
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
      orderByColumn:this.data.orderByColumn,
      isAsc:this.data.isAsc,
      keyword:this.data.keyword
    },{Authorization:wx.getStorageSync('Authorization')}).then(res=>{
      this.setData({
        materialList:[...this.data.courseList,...res.rows],
      })
    })
  },

  showMaterialDetailsInfo(e){
    var materialId = e.currentTarget.dataset.materialid;
    console.log("materialId",materialId);
    wx.navigateTo({
      url: '/pages/material/materialDetailInfo?materialId='+materialId
    })
  },
  onSearch(){
    this.setData({
      courseList:[]
    })
    this.getList()
  },
  onInput(event){
    this.setData({
      keyword: event.detail
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
    get("/system/category/allList",{},{Authorization:wx.getStorageSync('Authorization')}).then(res=>{
      this.setData({
        ['type.options']:res.data,
        ['courseType.options']:[
          {
            value: 'null',
            label: '全部',
          },
          {
            value: '0',
            label: '线下',
          },
          {
            value: '1',
            label: '线上',
          },
        ],
        ['school.options']:[
          {
            value: 'null',
            label: '全部',
          },
          {
            value: '0',
            label: '航空港',
          },
          {
            value: '1',
            label: '龙泉',
          },
        ],
      })
    })
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