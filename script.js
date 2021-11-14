
var resultView = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    activity: "",
    unit: "",
    amount: 0,
    units: [
      "miles", "kilometers", "minutes", "hours"
    ],
    form: true,
  }
})
  