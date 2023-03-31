class K1StaticRange {
  constructor(params) {
    this.values = params.values
    this.range = params.range
    this.slide = params.slide
    this.currentValue = this.values[0]
    this.markersData = {
      min: {value: params.current[0] ?? this.values[0].replace(/\D/g, "")},
      max: {value: params.current[1] ?? this.values[1].replace(/\D/g, "")}
    }
    this.maxValue = this.values[1]
    this.minValue = this.values[0]
    this.markers = null
    this.bindMarker = this.bindMarkerFunc.bind(this)
    this.currentNode = null
    this.bindRemoveCurrentClass = this.removeCurrentClass.bind(this)
    this.countMinLimit = this.values[0]
    this.distanceDisabled = null
    this.disabledPlaceholder = this.range.querySelector(".static-range__placeholder--disabled")
    this.placeholder = this.range.querySelector(".static-range__placeholder")
    this.currentMarker = null
    this.eventAfterChange = null
    this.currentMarkerType = null
    this.timeout = null
  }
  
  setDisabledDistance(val) {
    if (val !== undefined) {
      this.disabledPlaceholder.style.width = val
      return false
    }
    const limitLeft = this.countMinLimit.getBoundingClientRect().left
    const rangeLeft = this.range.getBoundingClientRect().left
    const different = limitLeft - rangeLeft;
    this.disabledPlaceholder.style.width = different + "px"
  }
  
  disableValues(value) {
    // const a = 5
    if (value > this.values[0]) {
      
      for (let val of this.markers) {
        const markerValue = val.getAttribute("data-value")
        if (+markerValue < value) {
          val.classList.add("disabled")
        } else {
          this.countMinLimit = val
          this.bindRemoveCurrentClass(this.markers)
          this.addCurrentClass(val)
          this.setDisabledDistance()
          break;
        }
      }
    }
  }
  
  enableValues() {
    for (let val of this.markers) {
      val.classList.remove("disabled")
    }
    this.setDisabledDistance(0)
  }
  
  makeValuesWrapper() {
    const node = document.createElement("div")
    node.classList.add("static-range__markers-wrapper")
    this.range.append(node)
    return node
  }
  
  makeValuesMarkers() {
    const node = document.createElement("div")
    node.classList.add("static-range__marker")
    return node
  }
  
  makeMarkerDescription(elem, attr) {
    const node = document.createElement("span")
    node.classList.add("static-range__marker-value")
    node.textContent = elem.getAttribute(attr)
    elem.append(node)
  }
  
  setMarkerPosition(marker, percent) {
    marker.style.left = `${percent}%`
    if (marker.getAttribute("data-type") === "min") {
      this.markersData.min.position = marker.getBoundingClientRect().x
    } else {
      this.markersData.max.position = marker.getBoundingClientRect().x
    }
  }
  
  getRangePosition() {
    const {x, y, width} = this.range.getBoundingClientRect()
    return {x, y, width}
  }
  
  putMarkers(arr) {
    const valuesBox = this.makeValuesWrapper()
    const attr = "data-value"
    arr.forEach(elem => {
      const marker = this.makeValuesMarkers()
      valuesBox.append(marker)
      marker.setAttribute(attr, elem)
      // this.makeMarkerDescription(marker, attr)
      if (this.markers === null) {
        this.markers = []
        this.markers.push(marker)
      } else {
        this.markers.push(marker)
      }
    })
  }
  
  removeCurrentClass(arr) {
    arr.forEach(elem => {
      elem.classList.remove("current")
    })
    // this.addCurrentClass()
  }
  
  addCurrentClass(node) {
    node.classList.add("current")
  }
  
  bindMarkerFunc(arr) {
    arr.forEach(marker => {
      marker.addEventListener("click", event => {
        this.bindRemoveCurrentClass(arr)
        this.currentNode = event.target.closest(".static-range__marker")
        this.currentValue = this.currentNode.getAttribute("data-value")
        this.addCurrentClass(this.currentNode)
        this.eventAfterChange = new CustomEvent("afterChange")
        this.range.dispatchEvent(this.eventAfterChange)
      })
    })
  }
  
  dispatchEventCustom() {
    this.eventAfterChange = new CustomEvent("afterChange")
    this.range.dispatchEvent(this.eventAfterChange)
  }
  
  setCurrentValue({target} = false) {
    if (target) {
      const _this = this
      
      target.value = (+target.value.replace(/\D/g, "")).toLocaleString()
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(function() {
        const type = target.getAttribute("data-type")
        if (type === "min") {
          let value = target.value.replace(/\D/g, ""), percent
          _this.markersData.min.value = value
          if (value >= _this.markersData.max.value) {
            _this.markersData.min.value = _this.markersData.max.value - 1
            target.value = _this.markersData.min.value.toLocaleString()
          }
          if (value < 0) {
            _this.markersData.min.value = target.value = 0
          }
          percent = _this.markersData.min.value / _this.maxValue * 100
          const def = _this.markersData.max.percent - percent
          _this.markersData.min.percent = percent
          if (def < 0.05) {
            percent = _this.markersData.max.percent - 0.5
          }
          _this.setMarkerPosition(_this.markers[0], percent)
        }
        if (type === "max") {
          const currentValue = +target.value.replace(/\D/g, "")
          let percent
          _this.markersData.max.value = +target.value.replace(/\D/g, "")
          
          if (currentValue <= _this.markersData.min.value) {
            _this.markersData.max.value = _this.markersData.min.value + 1
            target.value = _this.markersData.max.value.toLocaleString()
          }
          if (currentValue > _this.maxValue) {
            _this.markersData.max.value =  _this.maxValue
            target.value = _this.markersData.max.value.toLocaleString()
          }
          percent = _this.markersData.max.value / _this.maxValue * 100
          const def = percent - _this.markersData.min.percent
          _this.markersData.max.percent = percent
          if (def < 0.05) {
            percent = _this.markersData.min.percent + 0.5
          }
          _this.setMarkerPosition(_this.markers[1], percent)
        }
        _this.setStrokeStyle()
      },  700)
      return
      
    }
    this.markersData.min.value = Math.round(this.markersData.min.percent * this.maxValue / 100)
    this.markersData.max.value = Math.round(this.markersData.max.percent * this.maxValue / 100)
    this.dispatchEventCustom()
  }
  
  getCurrentValue() {
    return this.markersData
  }
  
  setPercent() {
  
  }
  
  
  moveHandler(event) {
    let x
    if (event.type === "mousemove") {
      x = event.x
    } else if (event.type === "touchmove") {
      x = event.touches[0].pageX
    }
    const {x: rangeX, width} = this.getRangePosition()
    if (!this.currentMarker) return false
    const percent = (x - rangeX) / width * 100
    let currentPercent = percent
    if (x >= rangeX && x <= width + rangeX) {
      if (this.currentMarkerType === "min") {
        if (this.markersData.max.position <= x) return false
        this.markersData.min.maxPosition = x
        this.markersData.min.percent = percent
        this.markersData.min.position = x
        this.setMarkerPosition(this.currentMarker, percent)
      }
      
      if (this.currentMarkerType === "max") {
        // console.log("pos", this.markersData.min.position)
        // console.log("x", x)
        if (this.markersData.min.position >= x) return false
        this.markersData.max.percent = percent
        this.markersData.max.position = x
        this.setMarkerPosition(this.currentMarker, percent)
      }
      
    }
    
    if (x > width + rangeX && this.currentMarkerType === "max") {
      this.setMarkerPosition(this.currentMarker, 100)
      this.markersData.max.percent = 100
      
    }
    if (x < rangeX && this.currentMarkerType === "min") {
      this.setMarkerPosition(this.currentMarker, 0)
      this.markersData.min.percent = 0
    }
    
    this.setStrokeStyle()
    this.setCurrentValue()
    this.currentDifference = this.markersData.max.value - this.markersData.min.value > 2
    // marker.addEventListener("touchstart", () => {
  }
  
  clickHandler({target}) {``
    const marker = target.closest('[data-value]')
    const _this = this
    
  }
  
  bindSlideMarkers() {
    this.markers.forEach(marker => {
      marker.addEventListener("mousedown", () => {
        this.currentMarker = marker
        this.currentMarkerType = this.currentMarker.getAttribute("data-type")
        window.addEventListener("mousemove", this.moveHandlerBind)
      })
      marker.addEventListener("touchstart", () => {
        this.currentMarker = marker
        this.currentMarkerType = this.currentMarker.getAttribute("data-type")
        window.addEventListener("touchmove", this.moveHandlerBind)
      })
      
      // marker.addEventListener("mousedown", this.clickHandlerBind)
      
    })
  }
  
  setStrokeStyle() {
    const {left} = window.getComputedStyle(this.markers[0])
    const {left: right} = window.getComputedStyle(this.markers[1])
    const pos = {
      left: parseInt(left.replace("px", "")),
      right: parseInt(right.replace("px", "")),
    }
    this.placeholder.style.left = `${pos.left}px`
    this.placeholder.style.maxWidth = `${pos.right - pos.left}px`
  }
  
  getPlaceholder() {
    return this.placeholder
  }
  
  init() {
    this.putMarkers(this.values)
    if (!this.slide) {
      
      // if (this.markers) {
      //   this.bindMarkerFunc(this.markers)
      //   this.addCurrentClass(this.markers[0])
      // }
      // this.disableValues()
    } else {
      this.moveHandlerBind = this.moveHandler.bind(this)
      const {x, width} = this.getRangePosition()
      window.addEventListener("mouseup", () => {
        this.currentMarker = null
        window.removeEventListener("mousemove", this.moveHandlerBind)
      })
      window.addEventListener("touchend", () => {
        this.currentMarker = null
        window.removeEventListener("touchmove", this.moveHandlerBind)
      })
      this.markers[0].setAttribute("data-type", "min")
      this.markers[1].setAttribute("data-type", "max")
      if (this.markersData.min.value && this.markersData.max.value) {
        
        this.markersData.min.percent = this.markersData.min.value / this.maxValue * 100
        this.markersData.max.percent = this.markersData.max.value / this.maxValue * 100
        
        this.setMarkerPosition(this.markers[0], this.markersData.min.percent)
        this.setMarkerPosition(this.markers[1], this.markersData.max.percent)
        
        this.markersData.min.position = this.markers[0].getBoundingClientRect().x
        this.markersData.max.position = this.markers[1].getBoundingClientRect().x
        this.setStrokeStyle()
      } else {
        this.setMarkerPosition(this.markers[0], 0)
        this.setMarkerPosition(this.markers[1], 100)
        this.markersData.min.percent = 0
        this.markersData.max.percent = 100
        this.setCurrentValue()
      }
      this.bindSlideMarkers()
      const strokeStrokeBind = this.setStrokeStyle.bind(this)
      window.addEventListener("resize", strokeStrokeBind)
    }
  }
}





















