export default function throttle(fn, interval) {
    //该变量用于记录上一次函数的执行事件
    let lastTime = 0
    const _throttle = function(...args) {
        // 获取当前时间
        const nowTime = new Date().getTime()
        
        // cd剩余时间
        const remainTime = nowTime - lastTime
        // 如果剩余时间大于间隔时间，也就是说可以再次执行函数
        if (remainTime - interval >= 0) {
            fn.apply(this, args)
            // 将上一次函数执行的时间设置为nowTime，这样下次才能重新进入cd
            lastTime = nowTime
        }
    }
    // 返回_throttle函数
    return _throttle
}