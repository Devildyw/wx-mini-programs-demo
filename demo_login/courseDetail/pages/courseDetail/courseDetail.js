/**

 * 如有技术问题或商业合作，可以添加本人微信:Exixir99

 * @author 全黑科技

 * @Time 2021-06-16 21:49:01

 * @URL http://www.abtwork.com/

 */
var app = getApp()

const {
  get,
  post
} = require('../../../utils/request')
const swiperList = [

];
const unLikedImage = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E6%9C%AA%E7%82%B9%E8%B5%9E%E5%9B%BE%E6%A0%87.png';
const likedImage = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E7%82%B9%E8%B5%9E%E5%9B%BE%E6%A0%87.png';
const defaultAvatar = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E5%8C%BF%E5%90%8D%E5%A4%B4%E5%83%8F.png';
const replyIcon = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E5%9B%9E%E7%AD%94.png';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    replyIcon:replyIcon,
    defaultAvatar: defaultAvatar,
    color: "",
    xh: "",
    isLogin: false,
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    is_bind: false,
    userInfo: {},
    courseDetailInfo: {},
    active: 0,
    // current: 1,
    autoplay: true,
    duration: 500,
    interval: 5000,
    swiperList,
    navigation: {
      type: '',
      showControls: true
    },
    tcourseId: 1,
    // 资料
    materialList: [],
    materialType: {
      value: 'all',
      options: [{
          value: 'all',
          label: '类别',
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
          value: 'markHigh',
          label: '按评分降序排序',
        },
        {
          value: 'personNumHigh',
          label: '按评分人数降序排序',
        },
        {
          value: 'personNumHigh',
          label: '按选择人数降序排序',
        },
      ],
    },
    likedImage: likedImage,
    unLikedImage: unLikedImage,
    onExchangeMaterialShow: false,
    image: 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/QQ%E5%9B%BE%E7%89%8720230608220001.png',
    evaluateSorter: {
      value: 'default',
      options: [{
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
          label: '按选择人数降序排序',
        },
      ],
    },
    QAList: [],
    right: [{
        text: '编辑',
        className: 'btn edit-btn',
      },
      {
        text: '删除',
        className: 'btn delete-btn',
      },
    ],
    studentList: [],
    onStudentInfoShow: false,
    onMaterialUploadShow: false,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    materialid: '',
    materialTypeValue: '',
    MaterialTypeText: '',
    types: [],
    fileList: [],
    gridConfig: {
      column: 1,
      width: 200,
      height: 200,
    },
    tempMaterialPath: '',
    materialUrl: '',
    materialImageUrl: '',
    material_desc: '',
    material_name: '',
    material_points: '',
    tempMaterialFileName: '',
    evaluateList: [],
    onEvaluateAddShow: false,
    rate: 0,
    frequencyValue: '',
    frequencyText: '',
    frequencyTypes: [{
      label: "基本不",
      value: "基本不"
    }, {
      label: "偶尔",
      value: "偶尔"
    }, {
      label: "经常",
      value: "经常"
    }, {
      label: "每次",
      value: "每次"
    }],
    gradeValue: '',
    gradeText: '',
    gradeTypes: [{
      label: "不及格",
      value: "不及格"
    }, {
      label: "60-70",
      value: "60-70"
    }, {
      label: "70-80",
      value: "70-80"
    }, {
      label: "80-90",
      value: "80-90"
    }, {
      label: "90以上",
      value: "90以上"
    }],
    wayValue: '',
    wayText: '',
    wayTypes: [{
      label: "闭卷",
      value: "闭卷"
    }, {
      label: "开卷",
      value: "开卷"
    }, {
      label: "论文",
      value: "论文"
    }, {
      label: "实验报告",
      value: "实验报告"
    }],
    evaluateContent: '',
    onQAAddShow:false,
    anonymity:false,
    question_title:'',
    question_desc:'',
    studentItem:{},
  },

  onQuestionDelete(e){
    const questionid = e.currentTarget.dataset.questionid
    post("/system/question/delete/question",{
      id:questionid
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res);
      if (res.code===200) {
        wx.showModal({
          title: '提示',
          content: '删除成功',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              
            }
          }
        })
        this.refreshCourseQAList()
      }
    })
    
  },

  inputQuestionTitle(e){
    this.setData({
      question_title:e.detail.value
    })
  },
  inputQuestionDesc(e){
    this.setData({
      question_desc:e.detail.value
    })
  },

  inputEvaluateContent(e) {
    this.setData({
      evaluateContent: e.detail.value
    })
  },
  addCourseEvaluate() {
    console.log(this.data);
    post("/system/evaluate/add/evaluate", {
      courseId: this.data.courseDetailInfo.courseId + "-" + this.data.courseDetailInfo.teacherId,
      examType: this.data.wayValue,
      finalScore: this.data.gradeValue,
      content: this.data.evaluateContent,
      attendanceFrequency: this.data.frequencyValue,
      points: this.data.rate
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      if (res.code === 200) {
        wx.showModal({
          title: '提示',
          content: '评价成功',
          complete: (res) => {
            if (res.cancel) {

            }

            if (res.confirm) {

            }
          }
        })
      }
      this.setData({
        frequencyValue: '',
        frequencyText: '',
        gradeValue: '',
        gradeText: '',
        wayValue: '',
        wayText: '',
        evaluateContent: "",
        rate: 0
      })
      this.getCourseDetailInfo();
      this.refreshCourseEvaluateList();
    })
  },

  onRateChange(e) {
    this.setData({
      rate: e.detail.value
    });
    console.log(this.data.rate);
  },

  selectAnonymity(e){
    this.setData({
      anonymity:e.detail.checked
    })
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
      this.getCourseDetailInfo();
    })
  },
  onAddQuestion(){
    if (this.data.question_title.length>18) {
      wx.showModal({
        title: '提示',
        content: '标题不得超过18字',
        complete: (res) => {
          if (res.cancel) {
            
          }
      
          if (res.confirm) {
            
          }
        }
      })
    }else{
      post("/system/question/add/question",{
        courseId:this.data.courseDetailInfo.courseId+"-"+this.data.courseDetailInfo.teacherId,
        title:this.data.question_title,
        description: this.data.question_desc,
        anonymity:this.data.anonymity
      },{
        Authorization:wx.getStorageSync('Authorization')
      }).then(res=>{
        if (res.code===200) {
          wx.showModal({
            title: '提示',
            content: '发布成功',
            complete: (res) => {
              if (res.cancel) {
                
              }
          
              if (res.confirm) {
                
              }
            }
          })
          this.setData({
            question_title:'',
            question_desc:'',
            anonymity:0
          })
        }
        this.refreshCourseQAList()
      })
    }
    
  },

  likeForEvaluate(e) {

    const evaluateItem = e.currentTarget.dataset.item;
    const index = e.currentTarget.dataset.index;
    post("/likes", {
      bizId: evaluateItem.id,
      bizType: 'course_evaluate',
      liked: !evaluateItem.liked
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {})

    this.setData({
      ['evaluateList[' + index + '].liked']: !evaluateItem.liked,
      ['evaluateList[' + index + '].likedTimes']: evaluateItem.liked ? --this.data.evaluateList[index].likedTimes : ++this.data.evaluateList[index].likedTimes,
    })
  },

  checkNumber() {
    if (!Number.isInteger(this.data.material_points)) {
      wx.showToast({
        title: '请输入数字',
      })
    }
  },
  /*------------------------*/
  handleAdd(e) {
    console.log(e);
    const {
      fileList
    } = this.data;
    const {
      files
    } = e.detail;

    // 方法1：选择完所有图片之后，统一上传，因此选择完就直接展示
    this.setData({
      fileList: [...fileList, ...files], // 此时设置了 fileList 之后才会展示选择的图片
    });

    console.log(this.data.fileList);

    // 方法2：每次选择图片都上传，展示每次上传图片的进度
    // files.forEach(file => this.uploadFile(file))
    wx.uploadFile({
      url: 'http://localhost:8080/common/oss/upload',
      filePath: e.detail.files[0].url,
      name: 'file',
      header: {
        Authorization: wx.getStorageSync('Authorization')
      },
      success: res => {
        const data = JSON.parse(res.data)
        this.setData({
          materialImageUrl: data.data
        })
      }
    })

  },

  handleRemove(e) {
    const {
      index
    } = e.detail;
    const {
      fileList
    } = this.data;

    fileList.splice(index, 1);
    this.setData({
      fileList,
    });
  },

  /****************************** */
  onColumnChange(e) {
    console.log('picker pick:', e);
  },

  /** 选择文件 */
  onUploadMaterialFile() {
    wx.uploadFile({
      url: 'http://localhost:8080/common/oss/upload',
      filePath: this.data.tempMaterialPath,
      name: 'file',
      header: {
        Authorization: wx.getStorageSync('Authorization')
      },
      success: res => {
        const data = JSON.parse(res.data)
        console.log("上传文件结果", data);
        this.setData({
          materialUrl: data.data
        })
      }
    })
  },

  inputMaterialDesc(e) {
    this.setData({
      material_desc: e.detail.value
    })
  },

  inputMaterialName(e) {
    this.setData({
      material_name: e.detail.value
    })
  },

  inputMaterialPoints(e) {
    this.setData({
      material_points: e.detail.value
    })
  },

  /** 上传资料 */
  onMaterialUpload() {
    console.log(this.data);
    post("/system/material/upload", {
      fileUrl: this.data.materialUrl,
      coverImageUrl: this.data.materialImageUrl,
      filename: this.data.material_name,
      type: this.data.materialTypeValue,
      description: this.data.material_desc,
      teacherCourseId: this.data.tcourseId,
      needPoints: this.data.material_points,
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      this.clearMaterialUploadInfo()
      this.refreshCourseMaterial()
    })

  },

  /**清空上传资料的残余信息 */
  clearMaterialUploadInfo() {
    this.setData({
      tempMaterialPath: '',
      materialUrl: '',
      materialImageUrl: '',
      material_desc: '',
      material_name: '',
      material_points: '',
      tempMaterialFileName: '',
      fileList: [],
      materialTypeValue: '',
      materialTypeText: ''
    })
  },
  /** 上传文件 */
  onSelectMaterialFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: res => {
        console.log(res);
        const tempMaterialFile = res.tempFiles[0];
        this.setData({
          tempMaterialPath: tempMaterialFile.path,
          tempMaterialFileName: tempMaterialFile.name
        })
        this.onUploadMaterialFile();
        console.log("url:", this.data.materialUrl);
      }
    })


  },

  onPickerChange(e) {
    const {
      key
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;

    console.log('picker change:', e.detail);

    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value[0],
      [`${key}Text`]: e.detail.label[0],
    });
  },

  onPickerCancel(e) {
    const {
      key
    } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  onWithoutTitlePicker() {
    this.setData({
      materialTypeVisible: true,
    });
  },


  onFrequencyPicker() {
    this.setData({
      frequencyVisible: true
    });
  },

  onGradePicker() {
    this.setData({
      gradeVisible: true
    });
  },

  onWayPicker() {
    this.setData({
      wayVisible: true
    });
  },

  /***************************** */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   tcourseId: options.tcourseId
    // });
    this.getCourseDetailInfo();
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })

    that.setData({
      starCount: that.coutNum(that.data.starCount),
      forksCount: that.coutNum(that.data.forksCount),
      visitTotal: that.coutNum(that.data.visitTotal)
    })
    wx.hideLoading()
  },
  showMaterialDetail(event) {
    wx.navigateTo({
      url: '/material/pages/material/materialDetailInfo?materialid=' + event.currentTarget.dataset.materialid,
    })
  },

  getCourseDetailInfo() {
    get("/system/course/info/" + this.data.tcourseId, {}, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      this.setData({
        courseDetailInfo: res.data,
        swiperList: [res.data.coverUrl]
      })
    })
  },
  deleteForEvaluate(e) {
    const evaluateid = e.currentTarget.dataset.evaluateid;
    post("/system/evaluate/delete/evaluate", {
      id: evaluateid
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      if (res.code === 200) {
        wx.showModal({
          title: '提示',
          content: '删除成功',
          complete: (res) => {
            if (res.cancel) {

            }

            if (res.confirm) {

            }
          }
        })


        this.refreshCourseEvaluateList();
        this.getCourseDetailInfo();
      }
    })
  },
  onEdit() {
    wx.showToast({
      title: '你点击了编辑',
      icon: 'none'
    });
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

  onStudentInfoClose() {
    this.setData({
      onStudentInfoShow: false,
      studentItem:{},
    });
  },
  onStudentInfoShow(e) {
    this.setData({
      studentItem:e.currentTarget.dataset.studentitem,
      onStudentInfoShow: true,

    })
  },
  onQAAddClose() {
    this.setData({
      onQAAddShow: false
    });
  },
  onQAAddShow() {
    this.setData({
      onQAAddShow: true
    })
  },
  onEvaluateAddClose() {
    this.setData({
      onEvaluateAddShow: false
    });
  },
  onEvaluateAddShow() {
    this.setData({
      onEvaluateAddShow: true
    })
  },
  onExchangeMaterialShow(event) {
    this.setData({
      onExchangeMaterialShow: true,
      materialid: event.currentTarget.dataset.materialid
    });
  },
  onExchangeMaterialClose() {
    this.setData({
      onStudentInfoShow: false
    })
  },

  onMaterialUploadClose() {
    this.setData({
      onMaterialUploadShow: false
    });
  },
  onMaterialUploadShow() {
    this.setData({
      onMaterialUploadShow: true
    })
  },

  onChange(event) {
    wx.pageScrollTo({
      selector: ".top",
      duration: 300
    })
    let index = event.detail.index;
    if (index === 0) {
      this.getCourseDetailInfo();
    } else if (index === 1) {
      this.refreshCourseMaterial();
      this.initMaterialTypes();
    } else if (index === 2) {
      this.getCourseDetailInfo();
      this.refreshCourseEvaluateList();
    } else if (index === 3) {
      this.refreshCourseQAList();
    } else if (index === 4) {
      this.refreshCourseStudentList();
    }
    this.setData({
      active: index
    })
  },


  refreshCourseStudentList(){
    this.setData({
      pageNum:1,
      total:0,
      studentList:[]
    })
    this.getCourseStudentList()
  },

  //初始化types
  initMaterialTypes() {
    get("/system/material/types", {}, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      this.setData({
        types: res.data
      })
    })
  },

  handlerBackTop(e) {
    wx.pageScrollTo({
      selector: ".top",
      duration: 300
    })
  },

  /**
   * 获取课程资料列表分页
   */
  getCourseMaterialList() {
    get("/system/originMaterial/page/list", {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      orderByColumn: 'tom.create_time',
      isAsc: 'desc',
      keyword: '',
      courseId: this.data.courseDetailInfo.courseId + "-" + this.data.courseDetailInfo.teacherId,
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      this.setData({
        materialList: [...this.data.materialList, ...res.rows],
        total: res.total,
        pageNum: ++this.data.pageNum
      })
    })
  },

  /**
   * 获取课程评价列表分页
   */
  getCourseEvaluateList() {
    get("/system/evaluate/page/list", {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      orderByColumn: 'create_time',
      isAsc: 'desc',
      courseId: this.data.courseDetailInfo.courseId + "-" + this.data.courseDetailInfo.teacherId,
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      this.setData({
        evaluateList: [...this.data.evaluateList, ...res.rows],
        total: res.total,
        pageNum: ++this.data.pageNum
      })
    })
  },

  refreshCourseEvaluateList() {
    this.setData({
      evaluateList: [],
      pageNum: 1
    })
    this.getCourseEvaluateList()
  },

  /**
   * 获取课程问答列表分页
   */
  getCourseQAList() {
    get("/system/question/page/list",{
      courseId: this.data.courseDetailInfo.courseId+"-"+this.data.courseDetailInfo.teacherId,
      pageNum:this.data.pageNum,
      pageSize:this.data.pageSize,
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      this.setData({
        QAList:[...this.data.QAList,...res.data.list],
        total:res.data.total,
        pageNum:++this.data.pageNum
      })
    })
  },

  refreshCourseQAList(){
    this.setData({
      pageNum:1,
      QAList:[],
    })
    this.getCourseQAList();
  },

  /**
   * 获取课程学生课表分页
   */
  getCourseStudentList() {
    get("/system/course/student/list",{
      tcourseId: this.data.courseDetailInfo.teacherCourseId,
      pageNo:this.data.pageNum,
      pageSize:this.data.pageSize
    },{
      Authorization:wx.getStorageSync('Authorization')
    }).then(res=>{
      console.log(res);
      this.setData({
        studentList:[...this.data.studentList, ...res.data.list],
        pageNum: ++this.data.pageNum,
        total: res.data.total
      })
    })
  },

  handleClick(e) {
    console.log(123456);
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
   * 兑换资料
   */
  exchangeMaterial() {
    post("/system/material/exchange/material", {
      id: this.data.materialid
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      if (res.code === 200) {
        wx.showModal({
          title: '兑换成功',
          content: '',
          complete: (res) => {
            if (res.cancel) {

            }

            if (res.confirm) {

            }
          }
        })
        this.refreshCourseMaterial()
        this.setData({
          onExchangeMaterialShow: false
        })
      }
    })
  },
  confirm() {

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

    get('/getInfo', {}, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      this.setData({
        userInfo: res.user
      })
    })

    this.onChange();
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  refreshCourseMaterial() {
    this.setData({
      pageNum: 1,
      pageSize: 10,
      materialList: []
    })
    this.getCourseMaterialList()
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



  showQADetail(e) {
    var questionId = e.currentTarget.dataset.questionid;
    wx.navigateTo({
      url: '/courseDetail/pages/courseDetail/QADetailInfo?questionId=' + questionId,
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
    if (this.data.active === 0) {
      return
    }

    if ((this.data.pageNum-1) * this.data.pageSize >= this.data.total) {
      wx.showToast({
        title: '已经到底了',
        icon:'none'
      })
    } else {
      if (this.data.active === 1) {
        //资料上拉触底
        this.getCourseMaterialList();
      }else if (this.data.active===2) {
        this.getCourseEvaluateList();
      }else if (this.data.active===3) {
        this.getCourseQAList();
      }else if (this.data.active===4) {
        this.getCourseStudentList();
      }
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})