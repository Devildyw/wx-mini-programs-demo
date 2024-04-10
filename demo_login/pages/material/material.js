const {get,post} = require('../../utils/request')

// pages/selectCourse/selectCourse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: {
      value: 'all',
      options: [
        {
          value: 'all',
          label: '类型',
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
    courseType: {
      value: 'all',
      options: [
        {
          value: 'all',
          label: '方式',
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
    },
    school: {
      value: 'all',
      options: [
        {
          value: 'all',
          label: '校区',
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
    },
    sorter: {
      value: 'default',
      options: [
        {
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
          label: '按兑换次数降序排序',
        },
      ],
    },
    keyword:'',
    materialList:[],
    pageNum:1,
    pageSize:10,
    orderByColumn:'',
    isAsc:'',
    lastTotal:0,
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
    this.getList()
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