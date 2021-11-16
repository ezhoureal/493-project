var resultView = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    records: [],
    activity: "",
    unit: "",
    amount: "",
    calories:"",
    units: [
      "MILES", "KILOMETERS", "MINUTES", "HOURS"
    ],
    form: true,
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
    submit() {
      if (!this.unit || !this.records || !this.activity) {
        return
      }
      if (this.amount == "1") {
        this.unit = this.unit.substring(0, this.unit.length - 1)
      }
      this.records.push({"unit": this.unit, "amount": this.amount, "activity": this.activity, "calories": this.calories})
      this.unit = this.amount = this.activity = this.calories = ""
      this.form = false
    }
  }
})
  