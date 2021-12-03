var resultView = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  components: {
    'apexchart': VueApexCharts
  },
  data: {
    user_weight: 150, //default to 150 lbs for now
    records: [],
    valid: "",
    activity: "",
    unit: "",
    amount: "",
    calories:"",
    user_theme: "",
    units: [
      "MILES", "MILE", "KILOMETERS", "KILOMETER", "MINUTES", "MINUTE", "HOURS", "HOUR"
    ],
    form: true,
    all_activities: {
      'aerobics': '6', 
      'backpacking': '7',
      'badminton': '4.5',
      'baseball': '5',
      'bicycling': '7',
      'calisthenics': '8',
      'pushups': '8',
      'pullups': '8',
      'situps': '8',
      'canoeing': '3',
      'kayaking': '5',
      'dancing': '5',
      'elliptical': '5.5',
      'football': '8',
      'frisbee': '3',
      'golfing': '5.5',
      'handball': '12',
      'hiking': '6',
      'ice hockey': '8',
      'ice skating': '7',
      'jogging': '7',
      'running': '10',
      'karate': '10',
      'kickboxing': '10',
      'pilates': '6',
      'ping pong': '4',
      'racquetball': '7',
      'raking': '4',
      'rock climbing (ascending)': '10',
      'rope jumping': '8',
      'rowing': '7',
      'rugby': '10',
      'sledding': '7',
      'snow skiing': '7',
      'soccer': '7',
      'softball': '5',
      'surfing': '3',
      'swimming': '6',
      'tae kwon do': '10',
      'tai chi': '4',
      'tennis': '7',
      'volleyball': '5',
      'walking': '4',
      'water aerobics': '4',
      'water polo': '10',
      'weight lifting': '3',
      'yoga hatha': '4'},
    graphMode: false,
    series: [], // for pie chart
    labels_original: [], // for pie chart legend
    chartOptions: {
      labels: [], // for pie chart legend
      chart: {
        foreColor: '#222',
        width: 480,
        type: 'donut',
      },
      dataLabels: {
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
        },
        enabled: true
      },
      legend: {
        fontSize: '14px',
        fontWeight: 800,
        itemMargin: {
          horizontal: 5,
          vertical: 3
        },
        formatter: function(val, opts) {
          return val + ": " + opts.w.globals.series[opts.seriesIndex] + " Cal."
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            show: false
          }
        }
      }]
    }
  },

  methods: {
    amount_update(event) {
      this.amount = event.target.value
    },
    activity_update(event) {
      this.activity = event.target.value
    },
    unit_update(event) {
      this.unit = event.target.value
    },
    convert_to_minutes() {
      if (this.unit == 'MINUTES') {
        return this.amount
      } else if (this.unit == 'HOURS') {
        return this.amount * 60
      } else {
        curr_result = this.amount
        if (this.activity == 'running') {
          curr_result *= 9
        } else if (this.activity == 'jogging') {
          curr_result *= 6
        } else if (this.activity == 'swimming') {
          curr_result *= 35
        } else if (this.activity == 'bicycling') {
          curr_result *= 5
        } else {
          alert('Invalid combination.')
          this.valid = false;
          return;
        }
        if (this.unit == 'MILES') {
          return curr_result
        } else {
          return curr_result / 1.61
        }
      }
    },
    match_and_calculate() {
      // fuzzy match an exercise
      fuzzy_set = FuzzySet(Object.keys(this.all_activities))
      match = fuzzy_set.get(this.activity, 'none', 0.3)[0][1]
      if (match == 'none' || match === undefined) {
        alert('Exercise not found.');
        this.valid = false;
        return;
      }
      this.activity = match
      in_minutes = this.convert_to_minutes()
      // rough calculation based considering weight
      var caloriesTotal = Math.abs(this.all_activities[match] * (this.user_weight / 2.2) * (in_minutes / 60))
      this.calories = caloriesTotal.toFixed(0)
    },
    submit() {
      this.valid = true;
      if (!this.unit || !this.records || !this.activity) {
        return
      }
      this.match_and_calculate()
      // only push valid activities
      if (this.valid) {
        // updating records
        this.records.push({"unit": this.unit, "amount": this.amount, "activity": this.activity, "calories": this.calories})
        // updating visualization series
        this.series.push(parseInt(this.calories))
        // updating visualization legend
        this.labels_original.push(this.activity)
        this.chartOptions = {...this.chartOptions, ...{
            labels: this.labels_original}
          }
        console.log(this.series)
      }
      this.unit = this.amount = this.activity = this.calories = ""
      this.form = false
    },
    setTheme(theme) {
      console.log("switching to " + theme);
      this.user_theme = theme;
      document.documentElement.className = theme;
      // apexchart-specific changes: only the first level in an object is reactive (?)
      if (theme == "dark_theme") {
        this.chartOptions = {...this.chartOptions, ...{
            chart: {
              foreColor: '#ddd'
            }}
          }
      } else {
        this.chartOptions = {...this.chartOptions, ...{
            chart: {
              foreColor: '#222'
            }}
          }
      }
    },
    toggleTheme() {
      if (this.user_theme == "light_theme" || this.user_theme == "") {
        this.setTheme("dark_theme");
      } else {
        this.setTheme("light_theme");
      }
    },
    toggleView() {
      console.log("Switching graph/table mode");
      this.graphMode = !this.graphMode;
    },
    undoAddActivity() {
      this.records.pop()
      this.series.pop()
      this.labels_original.pop()
      this.chartOptions = {...this.chartOptions, ...{
          labels: this.labels_original}
        }
    }
  }
})
  
