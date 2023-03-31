window.addEventListener("DOMContentLoaded", () => {
  const homeSlider = new Swiper(".home-friends__slider", {
    
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
      },
      480: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 4,
      },
      1024: {
        slidesPerView: 6,
      }
    }
  })
  
  const informationSlider = new Swiper(".information-help__slider .swiper", {
    
    loop: false,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      }
    }
  })
  
  const interestingSlider = new Swiper(".interesting__slider .swiper", {
    
    loop: false,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 3,
      }
    }
  })
  /*
  * Выпадающие окна их шапки сайта (меню и поиск)
  * */
  const headerActions = {
    menuButton: document.querySelector(".header-toggle-button-menu"),
    toggleMenuNode: document.querySelector(".header-toggle-menu"),
    toggleSearchNode: document.querySelector(".header-toggle-search"),
    searchButton: document.querySelector(".header-toggle-button-search"),
    closeSearchButton: document.querySelector(".header-toggle__close"),
    closeMenuButton: document.querySelector(".header-toggle__close-menu"),
    bodyNode: document.querySelector("body"),
    wrapperHandlerBind: null,
    windowClickHandler(type, {target}) {
      console.log(type)
      const isParentToggle = target.closest(".header-toggle.opened")
      if (!isParentToggle) {
        if (type === "menu") {
          this.menuButton.classList.remove("opened")
          this.toggleMenuNode.classList.remove("opened")
        }
      }
      this.bodyNode.classList.remove("no-scroll")
      window.removeEventListener("click", this.windowClickHandler.bind())
    },
    wrapperHandler({target}) {
      if (target.closest(".header-toggle-search") && !target.closest(".header-toggle")) {
        this.closeSearch()
      }
      if (!target.closest(".header-toggle") && target.closest(".header-toggle-menu")) {
        this.menuButton.classList.remove("opened")
        this.toggleMenuNode.classList.remove("opened")
        this.bodyNode.classList.remove("no-scroll")
      }
    },
    toggleMenu() {
      this.menuButton.classList.toggle("opened")
      this.toggleMenuNode.classList.toggle("opened")
      this.bodyNode.classList.toggle("no-scroll")
      
      this.toggleMenuNode.removeEventListener("click", this.wrapperHandlerBind)
      this.toggleMenuNode.addEventListener("click", this.wrapperHandlerBind)
    },
    showSearch() {
      this.searchButton.classList.add("opened")
      this.toggleSearchNode.classList.add("opened")
      this.bodyNode.classList.add("no-scroll")
      this.closeSearchButton.addEventListener("click", this.closeSearch.bind(this), {once: true})
      this.toggleSearchNode.removeEventListener("click", this.wrapperHandlerBind)
      this.toggleSearchNode.addEventListener("click", this.wrapperHandlerBind)
    },
    closeSearch() {
      this.searchButton.classList.remove("opened")
      this.toggleSearchNode.classList.remove("opened")
      this.bodyNode.classList.remove("no-scroll")
    },
    addHandlers() {
      this.menuButton?.addEventListener("click", this.toggleMenu.bind(this))
      this.closeMenuButton?.addEventListener("click", this.toggleMenu.bind(this))
      this.searchButton?.addEventListener("click", this.showSearch.bind(this))
    },
    setBlockedNodes() {
      this.toggleMenuNode.style.display = "block"
      this.toggleSearchNode.style.display = "block"
    },
    init() {
      this.wrapperHandlerBind = this.wrapperHandler.bind(this)
      setTimeout(this.setBlockedNodes.bind(this), 1500)
      this.addHandlers()
    }
  }
  /*
  * Кружки вокруг фото с прогрессом сбора
  * */
  const circleProgress = {
    circles: document.querySelectorAll(".progress-circle"),
    init() {
      this.circles.forEach(circle => {
        const percent = circle.getAttribute("data-percent")
        const picture = circle.querySelector("circle.current")
        const radius = picture.r.baseVal.value
        const length = 2 * Math.PI * radius
        picture.style.strokeDasharray = `${length} ${length}`
        picture.style.strokeDashoffset = length - length * percent / 100
      })
    }
  }
  /*
  * Некоторые обработчики форм
  * */
  const formUtils = {
    formName: "",
    modal: null,
    bodyNode: document.querySelector("body"),
    isValidatePhone(value) {
      return !(value.length < 11)
    },
    isValidMail(value) {
      const reg = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
      return reg.test(value)
    },
    removeInputError(node) {
      node.closest(".form-input").classList.remove("error")
    },
    inputHandler({target}) {
      const {name, value} = target
      switch (name) {
        case "mail" :
          if (this.isValidMail(value)) this.removeInputError(target)
          break
        case "phone" :
          if (this.isValidatePhone(value)) this.removeInputError(target)
          break;
      }
      
    },
    getFormData(formName) {
      const form = document.forms[formName]
      this.modal = form.closest(".modal")
      const formData = new FormData(form)
      const url = form.action || "url"
      const data = {}
      let hasError = false
      for (let pair of formData.entries()) {
        if (pair[0] === "form_text_1") {
          const input = form.querySelector("[name='form_text_1']").closest(".form-input")
          if (!this.isValidMail(pair[1])) {
            input.classList.add("error")
            hasError = true
            input.addEventListener("input", this.inputHandler.bind(this))
          } else {
            input.classList.remove("error")
            data[`${pair[0]}`] = pair[1]
          }
          continue
        }
        if (pair[0] === "form_text_19") {
          const input = form.querySelector("[name='form_text_19']").closest(".form-input")
          if (!this.isValidMail(pair[1])) {
            input.classList.add("error")
            hasError = true
            input.addEventListener("input", this.inputHandler.bind(this))
          } else {
            input.classList.remove("error")
            data[`${pair[0]}`] = pair[1]
          }
          continue
        }
        if (pair[0] === "form_text_20") {
          const area = form.querySelector("[name='form_text_20']").closest("div")
          if (!pair[1].length) {
            hasError = true
            area.classList.add("error")
            area.addEventListener("input", ({target}) => {
              if (target.value.length) {
                area.classList.remove("error")
              }
            })
          } else {
            data[`${pair[0]}`] = pair[1]
            area.classList.remove("error")
          }
          continue
        }
        if (pair[0] === "form_text_21") {
          const input = form.querySelector("[name='form_text_21']").closest(".form-input")
          if (!this.isValidatePhone(pair[1])) {
            input.classList.add("error")
            hasError = true
            input.addEventListener("input", this.inputHandler.bind(this))
          } else {
            input.classList.remove("error")
            data[`${pair[0]}`] = pair[1]
          }
          continue
        }
        if (pair[0] === "offer") {
          const area = form.querySelector("[name='offer']").closest("div")
          if (!pair[1].length) {
            hasError = true
            area.classList.add("error")
            area.addEventListener("input", ({target}) => {
              if (target.value.length) {
                area.classList.remove("error")
              }
            })
          } else {
            data[`${pair[0]}`] = pair[1]
            area.classList.remove("error")
          }
          continue
        }
        if (pair[0] === "phone") {
          const input = form.querySelector("[name='phone']").closest(".form-input")
          if (!this.isValidatePhone(pair[1])) {
            input.classList.add("error")
            hasError = true
            input.addEventListener("input", this.inputHandler.bind(this))
          } else {
            input.classList.remove("error")
            data[`${pair[0]}`] = pair[1]
          }
          continue
        }
        if (pair[0] === "mail") {
          const input = form.querySelector("[name='mail']").closest(".form-input")
          if (!this.isValidMail(pair[1])) {
            input.classList.add("error")
            hasError = true
            input.addEventListener("input", this.inputHandler.bind(this))
          } else {
            input.classList.remove("error")
            data[`${pair[0]}`] = pair[1]
          }
          continue
        }
        data[`${pair[0]}`] = pair[1]
      }
      return {
        data, hasError, url
      }
    },
    sendData(formName, event) {
      event.preventDefault();
      this.formName = formName
      const {data, hasError, url} = this.getFormData(formName)
      if (hasError) {
        console.log("error")
        return false
      } else {
        console.log("clean")
        // if (false) {
        if (url !== "url") {
          fetch(url, {
            method: "POST",
            body: JSON.stringify(data)
          }).then(res => res.json()).then(data => {
            console.log(data)
            if (!data?.error) {
              this.modal?.classList.remove("opened")
              this.showSuccessModal()
            }
          })
          console.log(data)
        } else {
          this.modal.classList.remove("opened")
          
          this.showSuccessModal()
        }
      }
    },
    cleanForm(formName) {
      const form = document.forms[formName]
      const formData = new FormData(form)
      for (let pair of formData.entries()) {
        form.querySelector(`[name=${pair[0]}]`).value = ""
      }
    },
    showSuccessModal() {
      const modal = document.querySelector(".modal[data-modal-name='success']")
      modal.classList.add("opened")
      this.cleanForm(this.formName)
      setTimeout(function () {
        this.bodyNode.classList.remove("no-scroll")
        modal.classList.remove("opened")
      }, 2000)
    }
  }
  /*
  * Модалки
  * */
  const modalVacancy = {
    bodyNode: document.querySelector("body"),
    modalBackArray: document.querySelectorAll(".modal-bg"),
    modalVacancyOpenArray: document.querySelectorAll("[data-modal='vacancy']"),
    
    currentModal: null,
    addListeners() {
      if (this.modalVacancyOpenArray.length) {
        this.modalVacancyOpenArray.forEach(button => {
          button.addEventListener("click", this.showModalBind)
        })
      }
     
    },
    showModal(event) {
      event.preventDefault()
      this.currentModal = document.querySelector("[data-modal-name='vacancy']")
      const hiddenInput = this.currentModal.querySelector("input[name='vacancy']")
      const button = event.target.closest(".vacancy__button")
      hiddenInput.value = button
        .closest(".vacancy__item")
        .querySelector(".vacancy__title span")
        .textContent
      this.currentModal.classList.add("opened")
      this.bodyNode.classList.add("no-scroll")
      this.currentModal.addEventListener("click", this.closeModalBind)
      window.addEventListener("keyup", this.closeModalBind)
      this.currentModal
        .querySelector("form")
        .addEventListener("submit", this.sendVacancyDataBind)
    },
    closeModal({key, keyCode, code, target, type}) {
      if (type === "keyup") {
        if (key === "Escape" || code === "Escape" || keyCode === 27) {
          this.currentModal.classList.remove('opened')
          this.bodyNode.classList.remove("no-scroll")
          this.currentModal.removeEventListener("click", this.closeModalBind)
          window.removeEventListener("keyup", this.closeModalBind)
          this.currentModal = null
        }
      }
      if (type === "click") {
        if (target.closest(".modal__body")) {
        
        } else {
          this.currentModal.classList.remove('opened')
          this.bodyNode.classList.remove("no-scroll")
          this.currentModal.removeEventListener("click", this.closeModalBind)
          window.removeEventListener("keyup", this.closeModalBind)
          this.currentModal = null
        }
      }
    },
    
    getVacancyData() {
      const form = document.forms["vacancy-form"]
      const formData = new FormData(form)
      const url = form.action || "string url"
      const data = {}
      let hasError = false
      for (let pair of formData.entries()) {
        if (pair[0] === "phone") {
          const input = form.querySelector("[name='phone']").closest(".form-input")
          if (!formUtils.isValidatePhone(pair[1])) {
            input.classList.add("error")
            hasError = true
            input.addEventListener("input", ({target}) => {
              if (formUtils.isValidatePhone(target.value)) this.removeInputError(target)
            })
          } else {
            input.classList.remove("error")
            data[`${pair[0]}`] = pair[1]
          }
          continue
        }
        if (pair[0] === "mail") {
          const input = form.querySelector("[name='mail']").closest(".form-input")
          if (!formUtils.isValidMail(pair[1])) {
            input.classList.add("error")
            hasError = true
            input.addEventListener("input", ({target}) => {
              if (formUtils.isValidMail(target.value)) this.removeInputError(target)
            })
          } else {
            input.classList.remove("error")
            data[`${pair[0]}`] = pair[1]
          }
          continue
        }
        data[`${pair[0]}`] = pair[1]
      }
      return {
        data, hasError, url
      }
    },
    sendVacancyData(event) {
      event.preventDefault();
      const {data, hasError, url} = this.getVacancyData()
      if (hasError) {
        console.log("error")
        return false
      } else {
        console.log("clean")
        if (url !== "string url") {
          fetch(url, {
            method: "POST",
            body: JSON.stringify(data)
          }).then(res => res.json()).then(data => {
            console.log(data)
            if (!data?.error) {
              this.showSuccessVacancyBind()
            }
          })
        } else {
          this.showSuccessVacancyBind()
        }
      }
    },
    showSuccessVacancy() {
      const modalSuccess = document.querySelector("[data-modal-name='success-vacancy']")
      this.currentModal.classList.remove("opened")
      // this.currentModal = null
      modalSuccess.classList.add("opened")
      setTimeout(function () {
        modalSuccess.classList.remove("opened")
      }, 2000)
      
    },
    removeInputError(node) {
      node.closest(".form-input").classList.remove("error")
    },
    init() {
      this.removeInputErrorBind = this.removeInputError.bind(this)
      this.showModalBind = this.showModal.bind(this)
      this.closeModalBind = this.closeModal.bind(this)
      this.sendVacancyDataBind = this.sendVacancyData.bind(this)
      this.showSuccessVacancyBind = this.showSuccessVacancy.bind(this)
      this.addListeners()
    }
  }
  
  const modalContacts = {
    modalOpen: document.querySelector(".contacts__button"),
    bodyNode: document.querySelector("body"),
    modal: document.querySelector(".modal[data-modal-name='feedback']"),
    showModal() {
      this.modal.classList.add("opened")
      this.bodyNode.classList.add("no-scroll")
      this.modal.addEventListener("click", this.closeModalBind)
      window.addEventListener("keyup", this.closeModalBind)
    },
    closeModal({key, keyCode, code, target, type}) {
      if (type === "keyup") {
        if (key === "Escape" || code === "Escape" || keyCode === 27) {
          this.modal.classList.remove('opened')
          this.bodyNode.classList.remove("no-scroll")
          this.modal.removeEventListener("click", this.closeModalBind)
          window.removeEventListener("keyup", this.closeModalBind)
        }
      }
      if (type === "click") {
        if (target.closest(".modal__body")) {
        
        } else {
          this.modal.classList.remove('opened')
          this.bodyNode.classList.remove("no-scroll")
          this.modal.removeEventListener("click", this.closeModalBind)
          window.removeEventListener("keyup", this.closeModalBind)
        }
      }
    },
    addListeners() {
      this.modalOpen.addEventListener("click", this.showModalBind)
    },
    init() {
      if (this.modalOpen) {
        this.form = this.modal.querySelector("form")
        this.closeModalBind = this.closeModal.bind(this)
        this.showModalBind = this.showModal.bind(this)
        this.form.addEventListener("submit", formUtils.sendData.bind(formUtils, "feedback-form"))
        this.addListeners()
      }
    }
  }
  /*
  * Выпадашки с контентом (например на странице вакансий)
  * */
  const toggle = {
    titles: document.querySelectorAll(".toggle-title"),
    toggle({target}) {
      const node = target.closest(".toggle-title")
      const content = node.nextElementSibling
      const height = content.scrollHeight
      node.classList.toggle("opened")
      if (node.classList.contains("opened"))
        content.style.maxHeight = `${height}px`
      else
        content.style.maxHeight = `0px`
    },
    
    init() {
      this.titles.forEach(title => {
        title.addEventListener("click", this.toggle.bind(this))
      })
    }
  }
  /*
  * Форма "стать другом"
  * */
  const friendsForm = {
    form: document.forms["friends-form"],
    init() {
      if (this.form) {
        this.form.addEventListener("submit", formUtils.sendData.bind(formUtils, "friends-form"))
      }
    }
  }
  /*
  * Форма подписки
  * */
  const dispatchForm = {
    form: document.forms["dispatch-form"],
    init() {
      if (this.form) {
        this.form.addEventListener("submit", formUtils.sendData.bind(formUtils, "dispatch-form"))
      }
    }
  }
  /*
  * Описывает большую картинку на детальной странице статьи
  * */
  const articleMainPicture = {
  
  }
  /*
  * Ползунки возраста
  * */
  const ageInputs = {
    min: document.querySelector("input[name='age-from']"),
    max: document.querySelector("input[name='age-to']"),
  }
  /*
  * Ползунки сумм
  * */
  const costInputs = {
    min: document.querySelector("input[name='cost-from']"),
    max: document.querySelector("input[name='cost-to']"),
  }
  
  if (ageInputs.min && ageInputs.max) {
    ageInputs.min.value = ageInputs.min.getAttribute("data-v").replace(/\D/g, "")
    ageInputs.max.value = ageInputs.max.getAttribute("data-v").replace(/\D/g, "")
    const params = {
      values: [
        ageInputs.min.getAttribute("data-v"),
        ageInputs.max.getAttribute("data-v")
      ],
      current: [
        ageInputs.min.value,
        ageInputs.max.value
      ],
      range: document.querySelector(".static-range-age"),
      slide: true
    }
    
    const ageRange = new K1StaticRange(params);
    ageInputs.min.addEventListener("input", ageRange.setCurrentValue.bind(ageRange))
    ageInputs.max.addEventListener("input", ageRange.setCurrentValue.bind(ageRange))
    ageRange.init()
    
    ageRange.range.addEventListener("afterChange", function () {
      const values = ageRange.getCurrentValue()
      ageInputs.min.value = values.min.value
      ageInputs.max.value = values.max.value
    })
    
  }
  
  if (costInputs.min && costInputs.max) {
    costInputs.min.value = costInputs.min.getAttribute("data-v").replace(/\D/g, "")
    costInputs.max.value = costInputs.max.getAttribute("data-v").replace(/\D/g, "")
    const params = {
      values: [
        +costInputs.min.getAttribute("data-v").replace(/\D/g, ""),
        +costInputs.max.getAttribute("data-v").replace(/\D/g, "")
      ],
      current: [
        +costInputs.min.value.replace(/\D/g, ""),
        +costInputs.max.value.replace(/\D/g, "")
      ],
      range: document.querySelector(".static-range-cost"),
      slide: true
    }
    
    
    const costRange = new K1StaticRange(params);
    costInputs.min.addEventListener("input", costRange.setCurrentValue.bind(costRange))
    costInputs.max.addEventListener("input", costRange.setCurrentValue.bind(costRange))
    costRange.init()
    
    costRange.range.addEventListener("afterChange", function () {
      const values = costRange.getCurrentValue()
      costInputs.min.value = values.min.value.toLocaleString()
      costInputs.max.value = values.max.value.toLocaleString()
    })
    
    const b = document.querySelector(".static-range-cost")
    
    window.addEventListener("resize", function () {
      // console.log(b.clientWidth)
      // costRange.getPlaceholder().style.width = `${b.clientWidth}px`
    })
    
  }
  /*
  * Кастомный селект
  * */
  const selectCustom = {
    elements: document.querySelectorAll(".select-custom"),
    valueHandler() {
    },
    toggleList({target}) {
      const block = target.closest(".select-custom")
      block.classList.toggle("opened")
      if (block.classList.contains("opened")) {
        this.listBlock.style.maxHeight = `${this.list.scrollHeight + 2}px`
      } else {
        this.listBlock.style.maxHeight = `0px`
      }
      
    },
    closeList() {
      this.listBlock.closest(".select-custom").classList.remove("opened")
      this.listBlock.style.maxHeight = `0px`
    },
    chooseValue({target}) {
      const value = target.textContent
      this.label.style.opacity = `0`
      this.input.value = value
      this.closeList()
    },
    init() {
      if (this.elements.length) {
        this.elements.forEach(elem => {
          
          const toggleNode = elem.querySelector(".select-custom__value")
          this.listBlock = elem.querySelector(".select-custom__list")
          this.list = this.listBlock.querySelector("ul")
          this.listItems = this.list.querySelectorAll("li")
          this.label = toggleNode.querySelector("label")
          this.input = toggleNode.querySelector("input")
          this.input.value = ""
          const chooseBind = this.chooseValue.bind(this)
          this.listItems.forEach(li => {
            li.addEventListener("click", chooseBind)
          })
          const toggleBind = this.toggleList.bind(this)
          toggleNode.addEventListener("click", toggleBind)
        })
      }
    }
  }
  
  const articleContent = {
    picture: document.querySelector(".article-content__main-picture"),
    introBlock: document.querySelector(".article"),
    contentBlock: document.querySelector(".article-content"),
    
    setMarginContent() {
      this.contentBlock.style.marginTop = `-${this.pictureHeight / 2}px`
    },
    setIntroPadding() {
      this.introBlock.style.paddingBottom = `${this.pictureHeight / 2}px`
    },
    setStyles() {
      this.pictureHeight = this.picture.clientHeight
      this.setIntroPadding()
      this.setMarginContent()
      this.section.style.paddingTop = `30px`
    },
    removeEmptyTags() {
      for(let child of this.content.children) {
        if (child.tagName === "P" && !child.textContent.trim() && !child.children.length) {
          child.remove()
        }
      }
      // this.content.children.forEach(child => {
      //   if (child.tagName === "P" && !child.textContent) child.remove()
      // })
    },
    addListener() {
      window.addEventListener("resize", this.setStyleBind)
    },
    init() {
      this.content = this.contentBlock?.querySelector(".visual-editor.article-body")
      if (this.picture) {
        
        this.section = this.contentBlock.querySelector(".section")
        this.setStyleBind = this.setStyles.bind(this)
      
        this.addListener()
        const _this = this
        window.addEventListener("load", _this.setStyles.bind(_this))
      
      }
      if (this.content) {
        this.removeEmptyTags()
      }
    
    }
  }
  
  /*
  * Описывает поведение форм на страницах "Помочь фонду" и "Карточка ребенка"
  * */
  const helpForm = {
    intervalInputs: document.querySelectorAll("input[name='pay-interval']"),
    payMethodBlock: document.querySelector(".card__method"),
    sendButtonCard: document.querySelector(".card__button"),
    sendButton: document.querySelector(".help-form__button"),
    costInput: document.querySelector("input[name='cost']"),
    customCostInput: document.querySelector("input#custom-cost"),
    cardPayBlock: document.querySelector(".card__credit"),
    smsPayBlock: document.querySelector(".card__sms"),
    /**/
    costInputs: document.querySelectorAll("input[name='cost-radio']"),
    payInputs: document.querySelectorAll("input[name='pay-radio']"),
    /**/
    
    
    
    toggleSMSBlock(value) {
      console.log(value)
      if (value === "pay-sms" || value === "sms") {
        this.cardPayBlock.classList.remove("opened")
        this.smsPayBlock.classList.add("opened")
      } else {
        this.cardPayBlock.classList.add("opened")
        this.smsPayBlock.classList.remove("opened")
      }
    },
    getData() {
      let hasError = false
      
      const data = {
        interval: "",
        cost: this.costInput.value,
        method: "card",
        name: document.querySelector("#pay-name").value,
        email: ""
      }
      data.interval = [...this.intervalInputs].filter(input => input.checked)[0].value
      const emailNode = document.querySelector("#pay-email")
      const isValid = formUtils.isValidMail(emailNode.value)
      if (!isValid) {
        emailNode.closest(".form-input").classList.add("error")
        hasError = true
        emailNode.addEventListener("input", formUtils.inputHandler.bind(formUtils))
      }
      if (hasError) return false
      return data
    },
    sendForm(formName, event) {
      event.preventDefault()
      const {data, hasError} = formUtils.getFormData(formName)
      
      
      if (hasError) return
      const url = "qwe";
      if (url !== "qwe") {
        fetch(url, {
          method: "POST",
          body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
          console.log(data)
          if (!data?.error) {
            this.showSuccessModal()
          }
        })
      } else {
        console.log(data)
        formUtils.showSuccessModal()
      }
    },
    togglePayMethodBlock(value) {
      if (this.payMethodBlock)
        this.payMethodBlock.style.display = value
    },
    
    /**/
    setCurrentCost(value) {
      this.costInput.value = value
    },
    showCustomCost(value) {
      const toggleBlock = document.querySelector(".card__custom-cost")
      const body = toggleBlock.querySelector(".card__custom-cost-body")
      if (value === "any") {
        toggleBlock.style.maxHeight = `${body.scrollHeight}px`
      } else {
        toggleBlock.style.maxHeight = `0px`
      }
    },
    setChosen(node) {
      let value
      if (!node) {
        this.costInputs.forEach(input => {
          input.closest(".card__radio").classList.remove("chosen")
          if (input.checked) {
            value = input.closest(".card__radio").value
            input.closest(".card__radio").classList.add("chosen")
            this.showCustomCost(input.value)
          }
        })
        this.payInputs.forEach(input => {
          input.closest(".card__radio").classList.remove("chosen")
          if (input.checked) {
            value = input.closest(".card__radio").value
            input.closest(".card__radio").classList.add("chosen")
          }
        })
      }
      
      if (node) {
        const currentList = document.querySelectorAll(`input[name='${node.name}']`)
        currentList.forEach(input => {
          input.closest(".card__radio").classList.remove("chosen")
        })
        const parent = node.closest(".card__radio")
        value = node.value
        parent.classList.add("chosen")
        if (node.name === "cost-radio") {
          this.showCustomCost(node.value)
        }
        if (node.name === "pay-radio") {
          this.toggleSMSBlock(node.value)
        }
      }
      if (value) {
        this.setCurrentCost(value)
      }
    },
    /**/
    
    
    init() {
      const _this = this
      if (this.intervalInputs.length) {
        [...this.intervalInputs].filter(input => {
          if (input.checked) {
            switch (input.value) {
              case "monthly":
                _this.togglePayMethodBlock("none")
                if (_this.sendButton) _this.sendButton.style.display = "block"
                break
              case "single":
                _this.togglePayMethodBlock("block")
                if (_this.sendButton) _this.sendButton.style.display = "block"
                break
              case "pay-sms":
                if (_this.sendButton) _this.sendButton.style.display = "none"
                break
            }
            this.toggleSMSBlock(input.value)
          }
          
        })
        this.intervalInputs.forEach(input => {
          input.addEventListener("change", ({target}) => {
            console.log("here", target.value)
            switch (target.value) {
              case "monthly":
                _this.togglePayMethodBlock("none")
                if (_this.sendButton) _this.sendButton.style.display = "block"
                break
              case "single":
                _this.togglePayMethodBlock("block")
                if (_this.sendButton) _this.sendButton.style.display = "block"
                break
              case "pay-sms":
                if (_this.sendButton) _this.sendButton.style.display = "none"
                break
            }
            this.toggleSMSBlock(target.value)
            if (this.payInputs.length) {
              this.payInputs.forEach(input => {
                if (input.checked) {
                  this.toggleSMSBlock(input.value)
                }
              })
            }
          })
        })
      }
      if (this.sendButtonCard) {
        this.sendButtonCard.addEventListener("click", this.sendForm.bind(this, "card-form"))
      }
      if (this.sendButton) {
        this.sendButton.addEventListener("click", this.sendForm.bind(this, "help-fond"))
      }
      if (this.customCostInput) {
        this.customCostInput.addEventListener("input", function () {
          this.value = this.value.replace(/\D/g, "")
          _this.costInput.value = this.value
          console.log(_this.costInput)
        })
      }
      /**/
      if (this.costInputs.length) {
        this.costInputs.forEach(input => {
          input.addEventListener("change", ({target}) => {
            _this.setChosen(target)
          })
        })
        _this.setChosen(false)
      }
      if (this.payInputs.length) {
        this.payInputs.forEach(input => {
          input.addEventListener("change", ({target}) => {
            _this.setChosen(target)
          })
          if (input.checked) {
            this.toggleSMSBlock(input.value)
          }
        })
        _this.setChosen(false)
      }
      /**/
      
      
    }
  }
  
  const simpleForm = document.forms["help-simple-form"]
  
  if (simpleForm) {
    simpleForm.addEventListener("submit", formUtils.sendData.bind(formUtils, "help-simple-form"))
  }
  
  helpForm.init()
  modalContacts.init()
  selectCustom.init()
  articleContent.init()
  friendsForm.init()
  dispatchForm.init()
  toggle.init();
  modalVacancy.init()
  headerActions.init()
  circleProgress.init()
  
  
})