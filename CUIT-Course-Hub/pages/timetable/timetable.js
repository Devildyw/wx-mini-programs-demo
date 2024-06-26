/**

 * 如有技术问题或商业合作，可以添加本人微信:Exixir99

 * @author 全黑科技

 * @Time 2021-06-16 21:49:01

 * @URL http://www.abtwork.com/

 */
const {get,post} = require('../../utils/request')
const time = require('../../utils/time')
var app = getApp()
Page({

  data: {
    uid: '',
    pwd: '',
    nickName: '',
    remind: '加载中',
    isLoading: true,
    _days: ['一', '二', '三', '四', '五', '六', '日'],
    course_days: ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'],
    activeClass: '',
    activeClassItem: 0,
    painting: {},
    shareImage: '',
    whichDayOfWeek: '',
    windowHeight: 0,
    screenHeight: 0,
    scroll: {
      left: 0 //判断今天是不周末，是的话滚一下
    },
    timeRow: [{
        l1: '第一小节',
        l2: '第二小节',
        t1: '8:20-9:05',
        t2: '9:15-10:00'
      },
      {
        l1: '第三小节',
        l2: '第四小节',
        t1: '10:20-11:05',
        t2: '11:15-12:00'
      },
      {
        l1: '第五小节',
        l2: '第六小节',
        t1: '14:00-14:45',
        t2: '14:55-15:40'
      },
      {
        l1: '第七小节',
        l2: '第八小节',
        t1: '16:00-16:45',
        t2: '16:55-17:40'
      },
      {
        l1: '第九小节',
        l2: '第十小节',
        t1: '19:30-20:15',
        t2: '20:25-21:10'
      },
    ],
    schoolYear:'',
    semester:'',
    schoolWeek:'',
    weekDay:'',
    classJson: '',
    targetLessons: [],
    targetX: 0, //target x轴top距离
    targetY: 0, //target y轴left距离
    targetDay: 0, //target day
    targetWid: 0, //target wid
    targetI: 0, //target 第几个active
    targetLen: 0, //target 课程长度
    blur: false,
    is_vacation: false, // 是否为假期
  },
  onLoad: function (options) {
    this.setInfo();
    this.getTable();

  },
  showQrcode() {
    //获取url
    let user=wx.getStorageSync('user')
    console.log(user)
    let urls=[]
    urls.push(user.course_img)
    wx.previewImage({
      urls: urls,
      current: user.course_img // 当前显示图片的http链接      
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  setInfo: function () {
    var that = this;
    const whichDayOfWeek = new Date().getDay();
    const arr = ['day7','day1', 'day2', 'day3', 'day4', 'day5', 'day6'];
    that.setData({
      whichDayOfWeek: arr[whichDayOfWeek],
    })
  },
  getTable: function () {
    this.setData({
      // classJson: user_data.course,
      isLoading: false
    })
  },
  changeActiveItem: function (e) {
    var that = this;
    // console.log(e);
    that.setData({
      activeClassItem: e.currentTarget.dataset.num,
    })
  },
  //下拉刷新执行
  onShow: function () {
    // classJson
    get('/system/lesson/course/table',{},{Authorization:wx.getStorageSync('Authorization')}).then(res=>{
      this.setData({
        schoolYear: res.data.course.schoolYear,
        semester:res.data.course.semester,
        schoolWeek:res.data.course.schoolWeek,
        weekDay:res.data.course.weekDay,
        is_vacation:res.data.course.is_vacation,
        classJson: res.data
      })
    })
  },
  onReady: function () {
    var that = this;
  },
  showDetail: function (e) {
    console.log(e)
    // 点击课程卡片后执行
    var that = this;
    that.setData({
      targetX: e.detail.x,
      targetY: e.detail.y,
      targetDay: 1,
      targetWid: 2,
      targetI: 1,
      blur: true,
      activeClass: e.currentTarget.dataset
    });
  },
  goClassPlace: function (ep) {
    console.log(ep.target.dataset.place);
    var placeArr = ["1教", "2教", "3教", "4教", "5教", "6教", "7教", "8教", "9教", "10教", "11教", "12教", "理工馆", "社科馆"];
    var markerIdArr = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 5, 4];
    var result = placeArr.indexOf(ep.target.dataset.place.slice(0, -3));
    // console.log(result);
    wx.navigateTo({
      url: '/pages/schoolNav/schoolNav?markerId=' + markerIdArr[result],
    })
  },
  hideDetail: function () {
    var that = this;
    // 点击遮罩层时触发，取消主体部分的模糊，清空target
    that.setData({
      blur: false,
      targetLessons: [],
      targetX: 0,
      targetY: 0,
      targetDay: 0,
      targetWid: 0,
      targetI: 0,
      targetLen: 0,
      activeClassItem: 0,
    });
  },
  catchMoveDetail: function () {
    /*阻止滑动穿透*/ },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    // console.log(res);
    return {
      title: that.data.nickName + '的个人课表',
      path: 'pages/classQuery/index?isShareFrom=true&uid=' + that.data.uid + '&pwd=' + that.data.pwd,
    }
  },
  refreshData: function () {
    wx.redirectTo({
      url: '/pages/index/vcode?to=grkb&update=1',
    })
  },
  eventDraw() {
    var that = this;
    if (that.data.shareImage != '') {
      wx.previewImage({
        urls: [that.data.shareImage],
      })
      wx.showToast({
        title: '图片已存至相册，可发给好友或设为壁纸',
        icon: 'none',
        duration: 3000
      })
      return
    }
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    const deviceInfo = wx.getSystemInfoSync();
    const screenWidth = deviceInfo.screenWidth;
    const screenHeight = deviceInfo.screenHeight;
    let topMargin = 10;
    if (screenHeight / screenWidth >= 1.8) {
      //检测是否为全面屏
      topMargin = 30;
    }
    var viewsArr = [{
      type: 'rect',
      background: '#fff',
      top: 0,
      left: 0,
      width: screenWidth,
      height: screenHeight
    }];
    //绘制星期
    const weekArr = ['周一', '周二', '周三', '周四', '周五'];
    for (let i = 0; i < weekArr.length; i++) {
      let rowTempArr = {
        type: 'text',
        content: weekArr[i],
        fontSize: 16,
        color: '#402D16',
        textAlign: 'left',
        top: topMargin,
        left: 30 + (i * ((screenWidth - 30) / weekArr.length)),
        bolder: true
      };
      viewsArr.push(rowTempArr);
    }
    //绘制节数
    for (let i = 1; i <= 12; i++) {
      let columnTempArr = {
        type: 'text',
        content: i,
        fontSize: 16,
        color: '#402D16',
        textAlign: 'center',
        top: (topMargin - 30) + (i * ((screenHeight - 30) / 12)),
        left: 10,
        bolder: true
      };
      viewsArr.push(columnTempArr);
    }

    const allCourseArr = that.data.classJson.course;
    let j = 0;
    for (let w in allCourseArr) {
      if (j < 5) {
        for (let i in allCourseArr[w]) {
          try {
            if (allCourseArr[w][i].courseName.length > 0) {
              let classTempBgArr = {
                type: 'rect',
                background: '#7acfa6',
                top: (topMargin + 30) + (2 * (i - 1) * ((screenHeight - 30) / 12)),
                left: Number(30 + (j * ((screenWidth - 30) / weekArr.length))),
                width: ((screenWidth - 30) / weekArr.length) - 1,
                height: (1 * ((screenHeight - 30) / 6)) - 1
              };
              viewsArr.push(classTempBgArr);
              let classTextTempArr = {
                type: 'text',
                content: allCourseArr[w][i].place + ' ' + allCourseArr[w][i].courseName,
                fontSize: 16,
                color: '#fff',
                textAlign: 'left',
                top: (topMargin + 30) + (2 * (i - 1) * ((screenHeight - 30) / 12) + 5),
                left: Number(30 + (j * ((screenWidth - 30) / weekArr.length)) + 5),
                breakWord: true,
                MaxLineNumber: 7,
                width: ((screenWidth - 30) / weekArr.length) - 20
              };
              viewsArr.push(classTextTempArr);
            }
          } catch (error) {
            let classTempBgArr = {
              type: 'rect',
              background: '#7acfa6',
              top: (topMargin + 30) + (2 * (i - 1) * ((screenHeight - 30) / 12)),
              left: Number(30 + (j * ((screenWidth - 30) / weekArr.length))),
              width: ((screenWidth - 30) / weekArr.length) - 1,
              height: (1 * ((screenHeight - 30) / 6)) - 1
            };
            viewsArr.push(classTempBgArr);
            let classTextTempArr = {
              type: 'text',
              content: allCourseArr[w][i][0].place + allCourseArr[w][i][0].courseName + ' ' + allCourseArr[w][i][1].place + allCourseArr[w][i][1].courseName,
              fontSize: 16,
              color: '#fff',
              textAlign: 'left',
              top: (topMargin + 30) + (2 * (i - 1) * ((screenHeight - 30) / 12) + 5),
              left: Number(30 + (j * ((screenWidth - 30) / weekArr.length)) + 5),
              breakWord: true,
              MaxLineNumber: 7,
              width: ((screenWidth - 30) / weekArr.length) - 20
            };
            viewsArr.push(classTextTempArr);
          }
        }
        j++;
      }
    }
    var canvasJson = {
      width: screenWidth,
      height: screenHeight,
      views: viewsArr
    };
    that.setData({
      painting: canvasJson
    })
  },
  eventGetImage(event) {
    var that = this;
    console.log(event)
    wx.hideLoading()
    const {
      tempFilePath,
      errMsg
    } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
      wx.previewImage({
        urls: [tempFilePath],
      })
      that.eventSave();
    }
  },
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '图片已存至相册，可发给好友或设为壁纸',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
})