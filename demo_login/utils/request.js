const app = getApp()
var baseurl = `http://localhost:8080` // 域名接口地址
let token = null
wx.getStorage({
    key: 'Authorization',
    success(res) {
        token = res.data
    }
})
const request = (url, options, header = {}) => {
    // 当发起请求的时候，界面出现“数据加载中...”的Loading界面
    wx.showLoading({
        title: '数据加载中...',
        mask: true
    })
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseurl + url, //请求的接口地址
            timeout: 5000, // 请求超时时间
            method: options.method, //配置method方法
            data: options.method === 'GET' ? options.data : JSON.stringify(options.data), //如果是GET,GET自动让数据成为query String,其他方法需要让options.data转化为字符串
            header: Object.assign(header, {
                'Content-Type': 'application/json; charset=UTF-8'
            }), //header中可以添加token值等
            success(request) { //监听成功后的操作
              console.log(request);
                if (request.data.code === 200) {
                    resolve(request.data)
                } else if(request.data.code === 401){
                  wx.showToast({
                    title: '用户登录已过期',
                    icon:'error',
                    duration:2000
                  })
                  wx.navigateTo({
                    url: '/pages/login/login',
                  }) 
                } else{
                  wx.showToast({
                    title: request.data.msg,
                    icon:'error',
                    duration:2000
                  })
                  reject(request.data)
                }
            },
            fail(error) { //返回失败也同样传入reject()方法
                reject(error)
                wx.showToast({
                    title: '错误!',
                    icon:'error',
                })
            },
            complete: () => {
                // 请求完成关闭Loading
                wx.hideLoading();
            }
        })
    })
}

//封装get方法
const get = (url, options = {},header) => {
    return request(url, {
        method: 'GET',
        data: options
    },header)
}

//封装post方法
const post = (url, options = {},header) => {
    return request(url, {
        method: 'POST',
        data: options
    },header)
}

//封装put方法
const put = (url, options,header) => {
    return request(url, {
        method: 'PUT',
        data: options
    },header)
}
//封装remove方法，DELETE关键字不能声明
const remove = (url, options = {},header) => {
    return request(url, {
        method: 'DELETE',
        data: options
    },header)
}

module.exports = {
    get,
    post,
    put,
    remove
}