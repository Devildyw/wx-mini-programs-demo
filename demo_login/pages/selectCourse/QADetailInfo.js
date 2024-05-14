const {
  get,
  post
} = require("../../utils/request");
const defaultAvatar = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E5%8C%BF%E5%90%8D%E5%A4%B4%E5%83%8F.png';
const replyIcon = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E5%9B%9E%E7%AD%94.png';
const unLikedImage = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E6%9C%AA%E7%82%B9%E8%B5%9E%E5%9B%BE%E6%A0%87.png';
const likedImage = 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E7%82%B9%E8%B5%9E%E5%9B%BE%E6%A0%87.png';
// pages/selectCourse/QADetailInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likedImage: likedImage,
    unLikedImage: unLikedImage,
    replyIcon: replyIcon,
    defaultAvatar: defaultAvatar,
    questionId: 1,
    userInfo: {},
    image: 'https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/QQ%E5%9B%BE%E7%89%8720230608220001.png',
    style: 'height: 248rpx',
    activeValues: [],
    QuestionDetail: {},
    pageNum: 1,
    active:0,
    deleteReplyId: '',
    pageSize: 10,
    total: 0,
    contentPageNum: 1,
    contentPageSize:10,
    contentTotal:0,
    contentList:[],
    ReplyList: [1, 2, 3, 4, 5, 6, 7, 8],
    show: false,
    anonymity: false,
    replyContent: '',
    showDeleteConfirm: false,
    cur: {},
    position: [{
        value: 'top',
        text: '顶部弹出'
      },
      {
        value: 'left',
        text: '左侧弹出'
      },
      {
        value: 'center',
        text: '中间弹出'
      },
      {
        value: 'bottom',
        text: '底部弹出'
      },
      {
        value: 'right',
        text: '右侧弹出'
      },
    ],
    replyItem:{},
  },

  noticeForDelete(e) {
    const userId = e.currentTarget.dataset.userid
    if (userId === this.data.userInfo.userId) {
      wx.showToast({
        title: '长按自己的回答即可删除',
        icon: "none"
      })
    }
  },
  getContentList(){

  },

  refreshContentList(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.setData({
    //   questionId:options.questionId
    // })
    this.getQuestionDetail();
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.refreshReplyList();
    this.noticeForDelete();
  },

  closeDelelteConfirm() {
    this.setData({
      showDeleteConfirm: false,
      deleteReplyId: ''
    })
  },
  showDeleteConfirm(e) {
    const userId = e.currentTarget.dataset.userid
    if (userId === this.data.userInfo.userId) {
      this.setData({
        showDeleteConfirm: true,
        deleteReplyId: e.currentTarget.dataset.replyid
      })
    }
  },
  getReplyList() {
    get("/system/reply/page/list", {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      questionId: this.data.questionId
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      console.log(res);
      this.setData({
        pageNum: ++this.data.pageNum,
        ReplyList: [...this.data.ReplyList, ...res.data.list],
        total: this.data.total
      })
    })
  },

  selectAnonymity(e) {
    this.setData({
      anonymity: e.detail.checked
    })
  },

  inputReplyContent(e) {
    console.log(e);
    this.setData({
      replyContent: e.detail.value
    })
  },

  replayForQuestion() {
    post("/system/reply/save/reply", {
      content: this.data.replyContent,
      anonymity: this.data.anonymity,
      questionId: this.data.QuestionDetail.id,
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      console.log(res);
      if (res.code === 200) {
        wx.showModal({
          title: '提示',
          content: '回答成功',
          complete: (res) => {
            if (res.cancel) {

            }

            if (res.confirm) {

            }
          }
        })
        this.setData({
          anonymity: false,
          content: ''
        })
        this.getQuestionDetail();
        this.refreshReplyList();
      }
    })
  },

  deleteForReply() {
    post("/system/reply/delete/reply",{
      id:this.data.deleteReplyId
    },
    {Authorization:wx.getStorageSync('Authorization')}).then(res=>{
      console.log(res);
      if (res.code===200) {
        wx.showModal({
          title: '提示',
          content: '删除成功，相应积分已被扣去',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              
            }
          }
        })
        this.refreshReplyList();
        this.getQuestionDetail();
        this.setData({
          showDeleteConfirm:false
        })
      }
    })
  },
  likeForReply(e) {
    const replyid = e.currentTarget.dataset.replyid;
    const index = e.currentTarget.dataset.index;
    post("/likes", {
      bizId: replyid,
      bizType: 'QA',
      liked: !this.data.ReplyList[index].liked
    }, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {})

    this.setData({
      ['ReplyList[' + index + '].liked']: !this.data.ReplyList[index].liked,
      ['ReplyList[' + index + '].likedTimes']: this.data.ReplyList[index].liked ? --this.data.ReplyList[index].likedTimes : ++this.data.ReplyList[index].likedTimes,
    })
    console.log("index,", this.data.evaluateList[index]);
  },
  refreshReplyList() {
    this.setData({
      pageNum: 1,
      ReplyList: []
    })
    this.getReplyList();
  },

  getQuestionDetail() {
    get("/system/question/query/" + this.data.questionId, {}, {
      Authorization: wx.getStorageSync('Authorization')
    }).then(res => {
      console.log(res);
      this.setData({
        QuestionDetail: res.data
      })
    })
  },

  handlePopup(e) {
    const {
      item
    } = e.currentTarget.dataset;

    this.setData({
        cur: item,
      },
      () => {
        this.setData({
          visible: true
        });
      },
    );
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },


  onOpen(e) {
    this.setData({
      replyItem:e.currentTarget.dataset.replyitem,
      show: true,
      active: 1
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  handleChange(e) {
    console.log(e.detail.value);
    this.setData({
      activeValues: e.detail.value,
    });
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
    if (this.data.active===0) {
      if (this.data.pageNum*this.data.pageSize>=this.data.total) {
         wx.showToast({
           title: '已经到底了',
           icon:'none'
         })
      } else {
        this.getReplyList();
      }
    }else if (this.data.active===1) {
        if (this.data.contentPageNum*this.data.contentPageSize>=this.data.contentTotal) {
          wx.showToast({
            title: '已经到底了',
            icon:'none'
          })
        } else {
          this.getContentList();
        }
    }
  },

  onClose() {
    this.setData({
      replyItem:{},
      show: false,
      active: 0
    });
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})