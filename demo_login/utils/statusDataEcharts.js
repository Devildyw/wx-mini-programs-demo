import * as echarts from '../ec-canvas/echarts';

let chart = null;

function statusChart(data1, data2) {
    return function initChart(canvas, width, height, dpr) {
        chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);

        var option = {
            xAxis: {
                type: 'category',
                data: data1
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function (item) {
                        var texts = []
                        switch (item) {
                            case 'NEED_LOSE_WEIGHT':
                                texts.push('需要减肥')
                                break
                            case 'SO_WEAK':
                                texts.push('弱不禁风')
                                break
                            case 'EAT_MORE':
                                texts.push('多吃点啦')
                                break
                            case 'BEAUTIFUL_HANDSOME':
                                texts.push('美丽帅气')
                                break
                            default:
                                texts.push('肥嘟嘟')
                        }
                        return texts
                    }
                }
            },
            series: [{
                data: data2,
                type: 'line'
            }]
        };
        chart.setOption(option);
        return chart;
    }
}

export {
    statusChart
};