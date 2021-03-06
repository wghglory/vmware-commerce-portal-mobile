export const echartOption = {
  dataset: [],
  grid: {
    left: '25%',
  },
  title: {
    // text: 'Usage Report for Last 12 Months',
    // left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      label: {
        formatter: function (params) {
          const d = new Date(params.value);
          // If axis.type is 'time'
          return d.toLocaleString('en-us', { year: 'numeric', month: 'short' });
        },
      },
    },
  },
  xAxis: {
    type: 'time',
    nameLocation: 'middle',
    offset: 10,
    // boundaryGap: true,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
      alignWithLabel: true,
    },
    axisLabel: {
      // interval: 1,
      // color: '#ccc',
    },
  },
  yAxis: {
    name: 'Points',
    nameGap: 20,
    offset: 10,
    splitNumber: 4,
    nameTextStyle: {
      align: 'right',
      verticalAlign: 'bottom',
    },
  },
  series: [],
};
