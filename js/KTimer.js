class KTimer {
  constructor(params) {
    this.endTime = params.endTime
    this.currentTime = params.currentTime
    this.days = {
      single: null
    }
    this.hours = {
      decimal: null,
      single: null
    }
    this.minutes = {
      decimal: null,
      single: null
    }
    this.seconds = {
      decimal: null,
      single: null
    }
    this.nodes = {
      days: {
        single: document.querySelector(".k1-timer__days")
      },
      hours: {
        single: document.querySelector(".k1-timer__hours_single"),
        decimal: document.querySelector(".k1-timer__hours_decimal")
      },
      minutes: {
        single: document.querySelector(".k1-timer__minutes_single"),
        decimal: document.querySelector(".k1-timer__minutes_decimal")
      },
      seconds: {
        single: document.querySelector(".k1-timer__seconds_single"),
        decimal: document.querySelector(".k1-timer__seconds_decimal")
      }
    }
    this.daysNode = document.querySelector(".k1-timer__separator_days")
    if (this.endTime > this.currentTime) this.init()
    // this.init()
  }
  setTimerValues() {
    const dif = this.endTime - this.currentTime
    if (dif <= 0) {
      location.reload()
      return false
    }
    const seconds = ("0" +  Math.floor((dif / 1000) % 60).toString()).slice(-2)
    const minutes = ("0" +  Math.floor((dif / 1000 / 60) % 60).toString()).slice(-2)
    const hours = ("0" +  Math.floor((dif / 1000 / 60 / 60) % 24 ).toString()).slice(-2)
    
    this.days.single = ("0" +  Math.floor((dif / 1000 / 60 / 60 ) / 24).toString()).slice(-1)
    this.hours.single = hours[1]
    this.hours.decimal = hours[0]
    this.minutes.single = minutes[1]
    this.minutes.decimal = minutes[0]
    this.seconds.single = seconds[1]
    this.seconds.decimal = seconds[0]
    this.daysNode.textContent = this.declensionNum(+this.days.single,['день', 'дня', 'дней'])
    this.printValues()
    
  }
  printValues() {
    for(let i in this.nodes) {
      if (this.nodes.hasOwnProperty(i)) {
        for(let key in this.nodes[i]) {
          if (this.nodes[i].hasOwnProperty(key)) {
            this.nodes[i][key].textContent = this[i][key]
          }
        }
      }
    }
  }
  declensionNum(num, words) {
    return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
  }
  init() {
    const _this = this
    _this.setTimerValues()
    setInterval(function() {
      _this.currentTime += 1000
      _this.setTimerValues()
    }, 1000)
    
  }
  

}
const params = {
  endTime: new Date(2023, 1, 21,14,45,0,).getTime(),
  currentTime: new Date().getTime()
}
const a = new KTimer(params)

// const b = document.querySelector("#button")
// const b1 = document.querySelector("#button-1")
// b.addEventListener("click", () => {
//   console.log("button")
//   b1.click()
//   b1.dispatchEvent(new KeyboardEvent('keydown', {
//       key: 'z',
//       char: 13,
//       ctrlKey: true
//     })
//   )
// })
//
// b1.addEventListener("keydown", event => {
//   console.log(event)
// })
//
// b1.addEventListener("click", () => {
//   console.log("button-1")
// })
//
// const params1 = {
//   mask: "+7 (9xx) xxx xx xx",
//   nodes: document.querySelectorAll("[name='k1-test']")
// }
// new PhoneMask(params1)
