const { get } = require("../../utils/request");

// pages/myself/myMaterialList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    exchangedMaterialList:[],
    uploadMaterialList:[],
    // onMaterialInfoShow:false,
    pageNum:1,
    pageSize:10,
    total:0
  },
  onChange(event) {
    const index =  event.detail.index;
    if (index===0) {
      this.refreshExchangedMaterialList();
    }else{
      this.refreshUploadMaterialList();
    }
    wx.pageScrollTo({
      selector:".top",
      duration: 300
    })
  },

  refreshExchangedMaterialList(){
    this.setData({
      pageNum:1,
      total:0,
      exchangedMaterialList:[]
    })
    this.getExchangedMaterialList();
  },

  refreshUploadMaterialList(){
    this.setData({
      pageNum:1,
      total:0,
      uploadMaterialList:[]
    })
    this.getUploadMaterialList();
  },

  getExchangedMaterialList(){
    get("/system/material/myself/1",{
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
      orderByColumn: 'tum.create_time',
      isAsc:'desc'
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res);
      if (res.code===200) {
        this.setData({
          pageNum:++this.data.pageNum,
          total:res.total,
          exchangedMaterialList:[...this.data.exchangedMaterialList,...res.rows]
        })
      }
    })
  },

  getUploadMaterialList(){
    get("/system/material/myself/0",{
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
      orderByColumn: 'tum.create_time',
      isAsc:'desc'
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res);
      if (res.code===200) {
        this.setData({
          pageNum:++this.data.pageNum,
          total:res.total,
          uploadMaterialList:[...this.data.uploadMaterialList,...res.rows]
        })
      }
    })
  },

  handlerBackTop(e) {
    wx.pageScrollTo({
      selector:".top",
      duration: 300
    })
  },
  
  showMaterialDetail(event) {
    wx.navigateTo({
      url: '/material/pages/material/materialDetailInfo?materialid=' + event.currentTarget.dataset.materialid,
    })
  },

  onMaterialInfoClose() {
    this.setData({ onMaterialInfoShow:false });
  },
  onMaterialInfoShow(){
    this.setData({
      onMaterialInfoShow:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.refreshExchangedMaterialList();
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