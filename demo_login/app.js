// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //没有token 跳转到登录页
    let token = null;
    token = wx.getStorageSync('Authorization')
    if (token) {
      wx.switchTab({
          url: '/pages/login/login',
      })
  }
  
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    user_data:{"course":{"course":{"星期一":[{"courseId":"191003,191001","courseName":"电磁场与电磁波,专业导论","place":"ES0106,科S501","startTime":"8:30","endTime":"10:00","teachWeek":"8-18周,1-4周","teacher":"杜艳秋* ,杨庆江* "},{"courseId":"","courseName":"","place":"","startTime":"10:15","endTime":"11:45","teachWeek":"","teacher":""},{"courseId":"191002","courseName":"信号与系统","place":"科E202","startTime":"14:30","endTime":"16:00","teachWeek":"7-18周","teacher":"王书侠* "},{"courseId":"191004","courseName":"微控制器原理及应用","place":"科E301","startTime":"16:15","endTime":"17:45","teachWeek":"1-10周","teacher":"张鹏* 杨庆江 "},{"courseId":"A19015","courseName":"四旋翼飞行器设计","place":"科E202","startTime":"19:00","endTime":"20:30","teachWeek":"6-12周","teacher":"冯新宇* "}],"星期二":[{"courseId":"191006","courseName":"信息检索","place":"科S209","startTime":"8:30","endTime":"10:00","teachWeek":"1-4周","teacher":"夏洪洋* "},{"courseId":"131015","courseName":"模拟电子技术","place":"科S104","startTime":"10:15","endTime":"11:45","teachWeek":"6-17周","teacher":"李娜* "},{"courseId":"281005,241013","courseName":"形势与政策,数学建模","place":"科E408,科S301","startTime":"14:30","endTime":"16:00","teachWeek":"9-12周,1-8周","teacher":"陈娇* ,张丽娟* "},{"courseId":"","courseName":"","place":"","startTime":"16:15","endTime":"17:45","teachWeek":"","teacher":""},{"courseId":"A19015","courseName":"四旋翼飞行器设计","place":"科E202","startTime":"19:00","endTime":"20:30","teachWeek":"6-12周","teacher":"冯新宇* "}],"星期三":[{"courseId":"","courseName":"","place":"","startTime":"8:30","endTime":"10:00","teachWeek":"","teacher":""},{"courseId":"","courseName":"","place":"","startTime":"10:15","endTime":"11:45","teachWeek":"","teacher":""},{"courseId":"191005","courseName":"计算机通信与网络","place":"科E506","startTime":"14:30","endTime":"16:00","teachWeek":"1-8周","teacher":"蒋洪波* "},{"courseId":"191004","courseName":"微控制器原理及应用","place":"科S109","startTime":"16:15","endTime":"17:45","teachWeek":"1-10周","teacher":"张鹏* 杨庆江 "},{"courseId":"","courseName":"","place":"","startTime":"19:00","endTime":"20:30","teachWeek":"","teacher":""}],"星期四":[{"courseId":"191001","courseName":"专业导论","place":"科S508","startTime":"8:30","endTime":"10:00","teachWeek":"1-4周","teacher":"杨庆江* "},{"courseId":"131015","courseName":"模拟电子技术","place":"科S104","startTime":"10:15","endTime":"11:45","teachWeek":"6-17周","teacher":"李娜* "},{"courseId":"241013","courseName":"数学建模","place":"科S301","startTime":"14:30","endTime":"16:00","teachWeek":"1-8周","teacher":"张丽娟* "},{"courseId":"191003","courseName":"电磁场与电磁波","place":"科S108","startTime":"16:15","endTime":"17:45","teachWeek":"8-18周","teacher":"杜艳秋* "},{"courseId":"","courseName":"","place":"","startTime":"19:00","endTime":"20:30","teachWeek":"","teacher":""}],"星期五":[{"courseId":"191005","courseName":"计算机通信与网络","place":"科N401","startTime":"8:30","endTime":"10:00","teachWeek":"1-8周","teacher":"蒋洪波* "},{"courseId":"191002","courseName":"信号与系统","place":"科N108","startTime":"10:15","endTime":"11:45","teachWeek":"7-18周","teacher":"王书侠* "},{"courseId":"191006","courseName":"信息检索","place":"科E406","startTime":"14:30","endTime":"16:00","teachWeek":"1-4周","teacher":"夏洪洋* "},{"courseId":"","courseName":"","place":"","startTime":"16:15","endTime":"17:45","teachWeek":"","teacher":""},{"courseId":"","courseName":"","place":"","startTime":"19:00","endTime":"20:30","teachWeek":"","teacher":""}],"星期六":[{"courseId":"","courseName":"","place":"","startTime":"8:30","endTime":"10:00","teachWeek":"","teacher":""},{"courseId":"","courseName":"","place":"","startTime":"10:15","endTime":"11:45","teachWeek":"","teacher":""},{"courseId":"","courseName":"","place":"","startTime":"14:30","endTime":"16:00","teachWeek":"","teacher":""},{"courseId":"","courseName":"","place":"","startTime":"16:15","endTime":"17:45","teachWeek":"","teacher":""},{"courseId":"","courseName":"","place":"","startTime":"19:00","endTime":"20:30","teachWeek":"","teacher":""}],"星期日":[{"courseId":"","courseName":"","place":"","startTime":"8:30","endTime":"10:00","teachWeek":"","teacher":""},{"courseId":"","courseName":"","place":"","startTime":"10:15","endTime":"11:45","teachWeek":"","teacher":""},{"courseId":"","courseName":"","place":"","startTime":"14:30","endTime":"16:00","teachWeek":"","teacher":""},{"courseId":"","courseName":"","place":"","startTime":"16:15","endTime":"17:45","teachWeek":"","teacher":""},{"courseId":"","courseName":"","place":"","startTime":"19:00","endTime":"20:30","teachWeek":"","teacher":""}]},"school_year":"2020-2021","semester":"学期2"}}
  }
})
