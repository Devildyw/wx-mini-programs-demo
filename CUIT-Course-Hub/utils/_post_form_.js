function _post_form(url, data, success, fail, complete, isShowNavBarLoading = true) {
    let _this = this;
    // 在当前页面显示导航条加载动画
    isShowNavBarLoading || true;
    if (isShowNavBarLoading == true) {
        wx.showNavigationBarLoading();
        wx.showLoading({
            mask: true,
            title: '加载中...',
        })
    }
    // 获取token
    let token = wx.getStorageSync('token');
    wx.request({
        url: 'xxxxxx', // 你的接口地址
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': token || ''
        },
        method: 'POST',
        data: data, // 你的请求参数
        success(res) {
            if (res.data.code === 4000) {
                // 登录失效
                wx.reLaunch({
                    url: "/xxxxxx" // 你的登陆页面地址
                });
                return false
            } else if (res.data.code !== 200 && res.data.code !== 4000) {
                // 全局错误提示
                wx.showModal({
                    title: '提示',
                    content: res.data.message,
                    showCancel: false,
                    success(res) {
                        fail && fail(res);
                    }
                });
                return false;
            }
            success && success(res.data); // 成功回调
        },
        fail(res) {
            wx.showModal({
                title: '提示',
                content: res.errMsg,
                showCancel: false,
                success(res) {
                    fail && fail(res);
                }
            });
        },
        complete(res) {
            wx.hideNavigationBarLoading();
            wx.hideLoading();
            complete && complete(res);
        }
    });
}