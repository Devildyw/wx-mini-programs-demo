const {get,post} = require('../../utils/request')

// pages/selectCourse/selectCourse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: {
      value: 'null',
      options: [
        {
          value: 'null',
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
      value: 'null',
      options: [
        {
          value: 'null',
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
      value: 'null',
      options: [
        {
          value: 'null',
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
      value: '',
      options: [
        {
          value: '',
          label: '默认排序',
        },
        {
          value: 'ttc.evaluate_score',
          label: '按评分降序排序',
        },
        {
          value: 'ttc.evaluate_num',
          label: '按评分人数降序排序',
        },
        {
          value: 'ttc.select_count',
          label: '按选择人数降序排序',
        },
      ],
    },
    keyword:'',
    courseList:[],
    pageNum:1,
    pageSize:10,
    orderByColumn:'',
    isAsc:'',
    total:0,
    userInfo:{},
    semester:'',
    right: [
      {
        text: '编辑',
        className: 'btn edit-btn',
      },
      {
        text: '删除',
        className: 'btn delete-btn',
      },
    ],
  },

  onActionClick({ detail }) {
    wx.showToast({ title: `你点击了${detail.text}`, icon: 'none' });
  },

  onChoice(e) {
    const teachercourseid = e.currentTarget.dataset.teachercourseid;
    post("/system/lesson/course/select",{
      teacherCourseId:teachercourseid
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res);
      if (res.code===200) {
        wx.showModal({
          title: '提示',
          content: '选课成功',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              
            }
          }
        })
      }
      this.onSearch();
    })
  },

  onDelete(e){
    const teachercourseid = e.currentTarget.dataset.teachercourseid;
    post("/system/lesson/course/cancel",{
      teacherCourseId:teachercourseid
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res);
      if (res.code===200) {
        wx.showModal({
          title: '提示',
          content: '取消成功',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              
            }
          }
        })
      }
      this.onSearch();
    })
  },

  onChange(e) {
    this.setData({
      'type.value': e.detail.value,
    });
    this.onSearch();
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
    this.onSearch();
  },

  onSchoolChange(e){
    this.setData({
      'school.value': e.detail.value,
    });
    this.onSearch();
  },

  onSortChange(e){
    this.setData({
      'sorter.value': e.detail.value,
    });
    this.onSearch();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      keyword:options.keyword!=null?options.keyword:'',
      userInfo:wx.getStorageSync('userInfo')
    });
    
  },

  getList(){
    get('/system/course/page/list',{
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
      orderByColumn:this.data.sorter.value,
      isAsc:'desc',
      keyword:this.data.keyword,
      gradeYearId:this.data.userInfo.gradeClass.gradeYearId,
      courseType:this.data.courseType.value==='null'?'':this.data.courseType.value,
      schoolId:this.data.school.value==='null'?'':this.data.school.value,
      type:this.data.type.value==='null'?'':this.data.type.value
    },{Authorization:wx.getStorageSync('Authorization')}).then(res=>{
      console.log(res);
      this.setData({
        pageNum:++this.data.pageNum,
        courseList:[...this.data.courseList,...res.rows],
        total:res.total
      })
    })
  },

  onSearch(){
    this.setData({
      courseList:[],
      pageNum:1,
      total:0,
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
            value: '1',
            label: '航空港',
          },
          {
            value: '2',
            label: '龙泉',
          },
        ],
      })
    });
    this.onSearch();
    wx.showToast({
      title: '右滑可查看更多操作',
      icon:'none'
    });
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
    if ((this.data.pageSize-1)*this.data.pageNum>=this.data.total) {
      wx.showToast({
        title: '已经到底了',
        icon:'none'
      })
    }else{
      this.getList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})