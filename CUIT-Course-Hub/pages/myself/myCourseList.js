const {get,post} = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    semester: {},
    courseList:[],
    lastTotal:0,
    userInfo:{},
    right: [
      {
        text: '删除',
        className: 'btn delete-btn',
      },
    ],
  },

  refreshCourseList(){
    this.setData({
      pageNum:1,
      total:0,
      courseList:[]
    })
    this.getCourseList();
  },
  getCourseList(){
    get("/system/course/my/list",{
      semester:this.data.semester.value
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res);
      this.setData({
        courseList:[...this.data.courseList,...res.data],
      })
    })
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
      url: '/courseDetail/pages/courseDetail/courseDetail?tcourseId='+tcourseId,
    })
  },
  onChange(e) {
    this.setData({
      'semester.value': e.detail.value,
    });
    console.log(this.data.semester.value);
    this.refreshCourseList();
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
    this.getSemesters();
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
    })
    // this.refreshCourseList();
  },

  getSemesters(){
    get("/common/semesters",{},{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res);
      this.setData({
        ['semester.options']:res.data.semesters,
        ['semester.value']:res.data.semester,
      })
      this.refreshCourseList();
    })
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