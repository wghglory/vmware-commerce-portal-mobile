export const chartSourceConfig = {
  yearMonth: {
    tickCount: 5,
    type: 'cat',
    formatter(value) {
      // value: 2019-12, 2020-01, 2020-02 ...
      // expect: Dec, 2020, Feb (January display the year)
      let ret;

      const date = new Date(value);
      if (date.getMonth() === 0) {
        // January --> display year
        ret = date.getFullYear();
      } else {
        // other months --> display Month
        ret = date.toLocaleString('en-us', { month: 'short' });
      }

      return ret;
    },
  },
};

export const tooltipConfig = {
  showXTip: true,
  // showYTip: true,
  snap: true,
  crosshairsType: 'xy',
  // crosshairsStyle: {
  //   lineDash: [2],
  // },
  showItemMarker: false,
  // triggerOn: ['touchstart', 'touchmove'],
  // triggerOff: 'touchend',
  onShow(ev) {
    const items = ev.items;
    items[0].name = items[0].origin.yearMonth;
    items[0].value = `${items[0].value} points`;
  },
};
