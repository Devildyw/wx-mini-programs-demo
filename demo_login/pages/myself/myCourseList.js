const {get,post} = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {
      value: 'all',
      options: [{
          value: 'all',
          label: '学期',
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
          value: 'price',
          label: '价格从高到低',
        },
      ],
    },
    keyword:'',
    courseList:[],
    pageNum:1,
    pageSize:10,
    orderByColumn:'',
    isAsc:'',
    lastTotal:0,
    userInfo:{},
    right: [
      {
        text: '删除',
        className: 'btn delete-btn',
      },
    ],
  },

  onActionClick({ detail }) {
    wx.showToast({ title: `你点击了${detail.text}`, icon: 'none' });
  },

  onReFund() {
    wx.showToast({ title: '你点击了选择', icon: 'none' });
  },

  showCourseDetailInfo(e){
    var tcourseId =  e.currentTarget.dataset.tcourseid;
    wx.navigateTo({
      url: '/pages/selectCourse/courseDetailInfo?tcourseId='+tcourseId,
    })
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
      keyword:options.keyword!=null?options.keyword:'',
      userInfo:wx.getStorageSync('userInfo')
    })
    console.log(this.data.userInfo);
  },

  getList(){
    get('/system/course/page/list',{
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
      orderByColumn:this.data.orderByColumn,
      isAsc:this.data.isAsc,
      keyword:this.data.keyword,
      gradeYearId:this.data.userInfo.gradeClass.gradeYearId,
    },{Authorization:wx.getStorageSync('Authorization')}).then(res=>{
      this.setData({
        courseList:[...this.data.courseList,...res.rows],
      })
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
      })
    });
    
    this.onSearch();
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