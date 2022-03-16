Highcharts.chart('container1', {
  chart: {
    backgroundColor: '#dbdbdb',
    type: 'xrange'
  },
  title: {
    text: 'Estimated Project Schedule'
  },
  accessibility: {
    point: {
      descriptionFormatter: function (point) {
        var ix = point.index + 1,
          category = point.yCategory,
          from = new Date(point.x),
          to = new Date(point.x2);
        return ix + '. ' + category + ', ' + from.toDateString() +
          ' to ' + to.toDateString() + '.';
      }
    }
  },
  xAxis: {
    type: 'datetime'
  },
  yAxis: {
    title: {
      text: ''
    },
    categories: ['PD', 'SD', 'DD', 'CD', 'Bid', 'CA'],
    reversed: true
  },
  series: [{
    name: 'Project 1',
    // pointPadding: 0,
    groupPadding: 0,
    borderColor: 'dark green',
    pointWidth: 20,
    data: [{
      x: Date.UTC(2021, 01, 21),
      x2: Date.UTC(2021, 02, 15),
      y: 0,
      partialFill: 0.55
    }, {
      x: Date.UTC(2021, 02, 10),
      x2: Date.UTC(2021, 03, 25),
      y: 1
    }, {
      x: Date.UTC(2021, 03, 27),
      x2: Date.UTC(2021, 05, 9),
      y: 2
    }, {
      x: Date.UTC(2021, 05, 15),
      x2: Date.UTC(2021, 08, 19),
      y: 3
    }, {
      x: Date.UTC(2021, 08, 25),
      x2: Date.UTC(2021, 10, 01),
      y: 4
    }, {
      x: Date.UTC(2021, 10, 20),
      x2: Date.UTC(2022, 04, 23),
      y: 5
    }],
    dataLabels: {
      enabled: true
    }
  }]

});