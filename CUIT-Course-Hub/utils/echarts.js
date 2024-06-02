import * as echarts from '../ec-canvas/echarts';

let chart = null;

function useChart(data1,data2) {
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
                data:data1
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data:data2,
                type: 'line'
            }]
        };
        chart.setOption(option);
        return chart;
    }
}

export {
    useChart
};