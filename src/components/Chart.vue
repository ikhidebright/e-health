<template>
  <div>
      <highcharts class="chart" :options="chartCompute"></highcharts>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      chartOptions: {
        chart: {
          type: 'bar'
        },
        title: {
          text: '2020 Patients Record'
        },
        subtitle: {
          text: 'Source: eHealth'
        },
        xAxis: {
          type: 'category',
          title: {
            text: 'Ages & Blood Groups'
          },
          labels: {
            rotation: 0,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Number of Patients'
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Number of Patients in 2020: <b>{point.y}</b>'
        },
        series: [{
          name: 'Population',
          data: this.data,
          dataLabels: {
            enabled: true,
            rotation: 0,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y}',
            y: 0,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        }]
      }
    }
  },
  computed: {
    chartCompute () {
      return this.chartOptions
    }
  }
}
</script>
