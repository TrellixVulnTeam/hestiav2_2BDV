Highcharts.chart('container', {
  data: {
    
    table: 'datatable'
  },
  chart: {
    backgroundColor: '#dbdbdb',
    type: 'pie'
  },
  title: {
    text: 'Initial Budget Chart'
  },
  yAxis: {
    allowDecimals: false,
    title: {
      text: 'Units'
    }
  },
  tooltip: {
    formatter: function () {
      return '<b>' + this.series.name + '</b><br/>' +
        this.point.y + ' ' + this.point.name.toLowerCase();
    }
  }
});