(() => {
    "use strict";
    const modules_flsModules = {};
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заполнен атрибут в ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ей, такого попа нет. Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll("div.select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    class SelectConstructor {
        constructor(props, data = null) {
            let defaultConfig = {
                init: true,
                logging: true,
                speed: 150
            };
            this.config = Object.assign(defaultConfig, props);
            this.selectClasses = {
                classSelect: "select",
                classSelectBody: "select__body",
                classSelectTitle: "select__title",
                classSelectValue: "select__value",
                classSelectLabel: "select__label",
                classSelectInput: "select__input",
                classSelectText: "select__text",
                classSelectLink: "select__link",
                classSelectOptions: "select__options",
                classSelectOptionsScroll: "select__scroll",
                classSelectOption: "select__option",
                classSelectContent: "select__content",
                classSelectRow: "select__row",
                classSelectData: "select__asset",
                classSelectDisabled: "_select-disabled",
                classSelectTag: "_select-tag",
                classSelectOpen: "_select-open",
                classSelectActive: "_select-active",
                classSelectFocus: "_select-focus",
                classSelectMultiple: "_select-multiple",
                classSelectCheckBox: "_select-checkbox",
                classSelectOptionSelected: "_select-selected",
                classSelectPseudoLabel: "_select-pseudo-label"
            };
            this._this = this;
            if (this.config.init) {
                const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select");
                if (selectItems.length) {
                    this.selectsInit(selectItems);
                    this.setLogging(`Проснулся, построил селекты: (${selectItems.length})`);
                } else this.setLogging("Сплю, нет ни одного select");
            }
        }
        getSelectClass(className) {
            return `.${className}`;
        }
        getSelectElement(selectItem, className) {
            return {
                originalSelect: selectItem.querySelector("select"),
                selectElement: selectItem.querySelector(this.getSelectClass(className))
            };
        }
        selectsInit(selectItems) {
            selectItems.forEach(((originalSelect, index) => {
                this.selectInit(originalSelect, index + 1);
            }));
            document.addEventListener("click", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusin", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusout", function(e) {
                this.selectsActions(e);
            }.bind(this));
        }
        selectInit(originalSelect, index) {
            const _this = this;
            let selectItem = document.createElement("div");
            selectItem.classList.add(this.selectClasses.classSelect);
            originalSelect.parentNode.insertBefore(selectItem, originalSelect);
            selectItem.appendChild(originalSelect);
            originalSelect.hidden = true;
            index ? originalSelect.dataset.id = index : null;
            if (this.getSelectPlaceholder(originalSelect)) {
                originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
                if (this.getSelectPlaceholder(originalSelect).label.show) {
                    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
                    selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
                }
            }
            selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
            this.selectBuild(originalSelect);
            originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
            this.config.speed = +originalSelect.dataset.speed;
            originalSelect.addEventListener("change", (function(e) {
                _this.selectChange(e);
            }));
        }
        selectBuild(originalSelect) {
            const selectItem = originalSelect.parentElement;
            selectItem.dataset.id = originalSelect.dataset.id;
            originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
            originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
            originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setOptions(selectItem, originalSelect);
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
            originalSelect.hasAttribute("data-open") ? this.selectAction(selectItem) : null;
            this.selectDisabled(selectItem, originalSelect);
        }
        selectsActions(e) {
            const targetElement = e.target;
            const targetType = e.type;
            if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                const selectItem = targetElement.closest(".select") ? targetElement.closest(".select") : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
                const originalSelect = this.getSelectElement(selectItem).originalSelect;
                if (targetType === "click") {
                    if (!originalSelect.disabled) if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                        const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
                        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
                        this.optionAction(selectItem, originalSelect, optionItem);
                    } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) this.selectAction(selectItem); else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
                        const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
                        this.optionAction(selectItem, originalSelect, optionItem);
                    }
                } else if (targetType === "focusin" || targetType === "focusout") {
                    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) targetType === "focusin" ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
                } else if (targetType === "keydown" && e.code === "Escape") this.selectsСlose();
            } else this.selectsСlose();
        }
        selectsСlose(selectOneGroup) {
            const selectsGroup = selectOneGroup ? selectOneGroup : document;
            const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
            if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem => {
                this.selectСlose(selectActiveItem);
            }));
        }
        selectСlose(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.remove(this.selectClasses.classSelectOpen);
                _slideUp(selectOptions, originalSelect.dataset.speed);
                setTimeout((() => {
                    selectItem.style.zIndex = "";
                }), originalSelect.dataset.speed);
            }
        }
        selectAction(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOpenzIndex = originalSelect.dataset.zIndex ? originalSelect.dataset.zIndex : 3;
            this.setOptionsPosition(selectItem);
            if (originalSelect.closest("[data-one-select]")) {
                const selectOneGroup = originalSelect.closest("[data-one-select]");
                this.selectsСlose(selectOneGroup);
            }
            setTimeout((() => {
                if (!selectOptions.classList.contains("_slide")) {
                    selectItem.classList.toggle(this.selectClasses.classSelectOpen);
                    _slideToggle(selectOptions, originalSelect.dataset.speed);
                    if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) selectItem.style.zIndex = selectOpenzIndex; else setTimeout((() => {
                        selectItem.style.zIndex = "";
                    }), originalSelect.dataset.speed);
                }
            }), 0);
        }
        setSelectTitleValue(selectItem, originalSelect) {
            const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
            const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
            if (selectItemTitle) selectItemTitle.remove();
            selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
        }
        getSelectTitleValue(selectItem, originalSelect) {
            let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
            if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
                selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`)).join("");
                if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
                    document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
                    if (originalSelect.hasAttribute("data-search")) selectTitleValue = false;
                }
            }
            selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : "";
            let pseudoAttribute = "";
            let pseudoAttributeClass = "";
            if (originalSelect.hasAttribute("data-pseudo-label")) {
                pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
                pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
            }
            this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
            if (originalSelect.hasAttribute("data-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`; else {
                const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
                return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
            }
        }
        getSelectElementContent(selectOption) {
            const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : "";
            const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
            let selectOptionContentHTML = ``;
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
            selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
            selectOptionContentHTML += selectOption.textContent;
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            return selectOptionContentHTML;
        }
        getSelectPlaceholder(originalSelect) {
            const selectPlaceholder = Array.from(originalSelect.options).find((option => !option.value));
            if (selectPlaceholder) return {
                value: selectPlaceholder.textContent,
                show: selectPlaceholder.hasAttribute("data-show"),
                label: {
                    show: selectPlaceholder.hasAttribute("data-label"),
                    text: selectPlaceholder.dataset.label
                }
            };
        }
        getSelectedOptionsData(originalSelect, type) {
            let selectedOptions = [];
            if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option => option.value)).filter((option => option.selected)); else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
            return {
                elements: selectedOptions.map((option => option)),
                values: selectedOptions.filter((option => option.value)).map((option => option.value)),
                html: selectedOptions.map((option => this.getSelectElementContent(option)))
            };
        }
        getOptions(originalSelect) {
            const selectOptionsScroll = originalSelect.hasAttribute("data-scroll") ? `data-simplebar` : "";
            const customMaxHeightValue = +originalSelect.dataset.scroll ? +originalSelect.dataset.scroll : null;
            let selectOptions = Array.from(originalSelect.options);
            if (selectOptions.length > 0) {
                let selectOptionsHTML = ``;
                if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option => option.value));
                selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ""} class="${this.selectClasses.classSelectOptionsScroll}">`;
                selectOptions.forEach((selectOption => {
                    selectOptionsHTML += this.getOption(selectOption, originalSelect);
                }));
                selectOptionsHTML += `</div>`;
                return selectOptionsHTML;
            }
        }
        getOption(selectOption, originalSelect) {
            const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
            const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? `hidden` : ``;
            const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : "";
            const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
            const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank") ? `target="_blank"` : "";
            let selectOptionHTML = ``;
            selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
            selectOptionHTML += this.getSelectElementContent(selectOption);
            selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
            return selectOptionHTML;
        }
        setOptions(selectItem, originalSelect) {
            const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            selectItemOptions.innerHTML = this.getOptions(originalSelect);
        }
        setOptionsPosition(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
            const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
            const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;
            if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
                selectOptions.hidden = false;
                const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue("max-height"));
                const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
                const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
                selectOptions.hidden = true;
                const selectItemHeight = selectItem.offsetHeight;
                const selectItemPos = selectItem.getBoundingClientRect().top;
                const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
                const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);
                if (selectItemResult < 0) {
                    const newMaxHeightValue = selectOptionsHeight + selectItemResult;
                    if (newMaxHeightValue < 100) {
                        selectItem.classList.add("select--show-top");
                        selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
                    } else {
                        selectItem.classList.remove("select--show-top");
                        selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
                    }
                }
            } else setTimeout((() => {
                selectItem.classList.remove("select--show-top");
                selectItemScroll.style.maxHeight = customMaxHeightValue;
            }), +originalSelect.dataset.speed);
        }
        optionAction(selectItem, originalSelect, optionItem) {
            const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
            if (!selectOptions.classList.contains("_slide")) {
                if (originalSelect.multiple) {
                    optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
                    const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
                    originalSelectSelectedItems.forEach((originalSelectSelectedItem => {
                        originalSelectSelectedItem.removeAttribute("selected");
                    }));
                    const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
                    selectSelectedItems.forEach((selectSelectedItems => {
                        originalSelect.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`).setAttribute("selected", "selected");
                    }));
                } else {
                    if (!originalSelect.hasAttribute("data-show-selected")) setTimeout((() => {
                        if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
                        optionItem.hidden = true;
                    }), this.config.speed);
                    originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
                    this.selectAction(selectItem);
                }
                this.setSelectTitleValue(selectItem, originalSelect);
                this.setSelectChange(originalSelect);
            }
        }
        selectChange(e) {
            const originalSelect = e.target;
            this.selectBuild(originalSelect);
            this.setSelectChange(originalSelect);
        }
        setSelectChange(originalSelect) {
            if (originalSelect.hasAttribute("data-validate")) formValidate.validateInput(originalSelect);
            if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
                let tempButton = document.createElement("button");
                tempButton.type = "submit";
                originalSelect.closest("form").append(tempButton);
                tempButton.click();
                tempButton.remove();
            }
            const selectItem = originalSelect.parentElement;
            this.selectCallback(selectItem, originalSelect);
        }
        selectDisabled(selectItem, originalSelect) {
            if (originalSelect.disabled) {
                selectItem.classList.add(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
            } else {
                selectItem.classList.remove(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
            }
        }
        searchActions(selectItem) {
            this.getSelectElement(selectItem).originalSelect;
            const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
            const _this = this;
            selectInput.addEventListener("input", (function() {
                selectOptionsItems.forEach((selectOptionsItem => {
                    if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) selectOptionsItem.hidden = false; else selectOptionsItem.hidden = true;
                }));
                selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
            }));
        }
        selectCallback(selectItem, originalSelect) {
            document.dispatchEvent(new CustomEvent("selectCallback", {
                detail: {
                    select: originalSelect
                }
            }));
        }
        setLogging(message) {
            this.config.logging ? functions_FLS(`[select]: ${message} `) : null;
        }
    }
    modules_flsModules.select = new SelectConstructor({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const ledger = new WeakMap;
    function editLedger(wanted, baseElement, callback, setup) {
        if (!wanted && !ledger.has(baseElement)) return false;
        const elementMap = ledger.get(baseElement) ?? new WeakMap;
        ledger.set(baseElement, elementMap);
        const setups = elementMap.get(callback) ?? new Set;
        elementMap.set(callback, setups);
        const existed = setups.has(setup);
        if (wanted) setups.add(setup); else setups.delete(setup);
        return existed && wanted;
    }
    function safeClosest(event, selector) {
        let target = event.target;
        if (target instanceof Text) target = target.parentElement;
        if (target instanceof Element && event.currentTarget instanceof Element) {
            const closest = target.closest(selector);
            if (closest && event.currentTarget.contains(closest)) return closest;
        }
    }
    function delegate_delegate(selector, type, callback, options = {}) {
        const {signal, base = document} = options;
        if (signal?.aborted) return;
        const {once, ...nativeListenerOptions} = options;
        const baseElement = base instanceof Document ? base.documentElement : base;
        const capture = Boolean(typeof options === "object" ? options.capture : options);
        const listenerFunction = event => {
            const delegateTarget = safeClosest(event, String(selector));
            if (delegateTarget) {
                const delegateEvent = Object.assign(event, {
                    delegateTarget
                });
                callback.call(baseElement, delegateEvent);
                if (once) {
                    baseElement.removeEventListener(type, listenerFunction, nativeListenerOptions);
                    editLedger(false, baseElement, callback, setup);
                }
            }
        };
        const setup = JSON.stringify({
            selector,
            type,
            capture
        });
        const isAlreadyListening = editLedger(true, baseElement, callback, setup);
        if (!isAlreadyListening) baseElement.addEventListener(type, listenerFunction, nativeListenerOptions);
        signal?.addEventListener("abort", (() => {
            editLedger(false, baseElement, callback, setup);
        }));
    }
    const delegate_it_delegate = delegate_delegate;
    function i() {
        return i = Object.assign ? Object.assign.bind() : function(t) {
            for (var e = 1; e < arguments.length; e++) {
                var i = arguments[e];
                for (var s in i) ({}).hasOwnProperty.call(i, s) && (t[s] = i[s]);
            }
            return t;
        }, i.apply(null, arguments);
    }
    const s = (t, e) => String(t).toLowerCase().replace(/[\s/_.]+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "") || e || "", n = ({hash: t} = {}) => window.location.pathname + window.location.search + (t ? window.location.hash : ""), o = (t, e = {}) => {
        const s = i({
            url: t = t || n({
                hash: !0
            }),
            random: Math.random(),
            source: "swup"
        }, e);
        window.history.pushState(s, "", t);
    }, r = (t = null, e = {}) => {
        t = t || n({
            hash: !0
        });
        const s = i({}, window.history.state || {}, {
            url: t,
            random: Math.random(),
            source: "swup"
        }, e);
        window.history.replaceState(s, "", t);
    }, a = (e, s, n, o) => {
        const r = new AbortController;
        return o = i({}, o, {
            signal: r.signal
        }), delegate_it_delegate(e, s, n, o), {
            destroy: () => r.abort()
        };
    };
    class l extends URL {
        constructor(t, e = document.baseURI) {
            super(t.toString(), e), Object.setPrototypeOf(this, l.prototype);
        }
        get url() {
            return this.pathname + this.search;
        }
        static fromElement(t) {
            const e = t.getAttribute("href") || t.getAttribute("xlink:href") || "";
            return new l(e);
        }
        static fromUrl(t) {
            return new l(t);
        }
    }
    class c extends Error {
        constructor(t, e) {
            super(t), this.url = void 0, this.status = void 0, this.aborted = void 0, this.timedOut = void 0, 
            this.name = "FetchError", this.url = e.url, this.status = e.status, this.aborted = e.aborted || !1, 
            this.timedOut = e.timedOut || !1;
        }
    }
    async function u(t, e = {}) {
        var s;
        t = l.fromUrl(t).url;
        const {visit: n = this.visit} = e, o = i({}, this.options.requestHeaders, e.headers), r = null != (s = e.timeout) ? s : this.options.timeout, a = new AbortController, {signal: h} = a;
        e = i({}, e, {
            headers: o,
            signal: h
        });
        let u, d = !1, p = null;
        r && r > 0 && (p = setTimeout((() => {
            d = !0, a.abort("timeout");
        }), r));
        try {
            u = await this.hooks.call("fetch:request", n, {
                url: t,
                options: e
            }, ((t, {url: e, options: i}) => fetch(e, i))), p && clearTimeout(p);
        } catch (e) {
            if (d) throw this.hooks.call("fetch:timeout", n, {
                url: t
            }), new c(`Request timed out: ${t}`, {
                url: t,
                timedOut: d
            });
            if ("AbortError" === (null == e ? void 0 : e.name) || h.aborted) throw new c(`Request aborted: ${t}`, {
                url: t,
                aborted: !0
            });
            throw e;
        }
        const {status: m, url: w} = u, f = await u.text();
        if (500 === m) throw this.hooks.call("fetch:error", n, {
            status: m,
            response: u,
            url: w
        }), new c(`Server error: ${w}`, {
            status: m,
            url: w
        });
        if (!f) throw new c(`Empty response: ${w}`, {
            status: m,
            url: w
        });
        const {url: g} = l.fromUrl(w), v = {
            url: g,
            html: f
        };
        return !n.cache.write || e.method && "GET" !== e.method || t !== g || this.cache.set(v.url, v), 
        v;
    }
    class d {
        constructor(t) {
            this.swup = void 0, this.pages = new Map, this.swup = t;
        }
        get size() {
            return this.pages.size;
        }
        get all() {
            const t = new Map;
            return this.pages.forEach(((e, s) => {
                t.set(s, i({}, e));
            })), t;
        }
        has(t) {
            return this.pages.has(this.resolve(t));
        }
        get(t) {
            const e = this.pages.get(this.resolve(t));
            return e ? i({}, e) : e;
        }
        set(t, e) {
            e = i({}, e, {
                url: t = this.resolve(t)
            }), this.pages.set(t, e), this.swup.hooks.callSync("cache:set", void 0, {
                page: e
            });
        }
        update(t, e) {
            t = this.resolve(t);
            const s = i({}, this.get(t), e, {
                url: t
            });
            this.pages.set(t, s);
        }
        delete(t) {
            this.pages.delete(this.resolve(t));
        }
        clear() {
            this.pages.clear(), this.swup.hooks.callSync("cache:clear", void 0, void 0);
        }
        prune(t) {
            this.pages.forEach(((e, i) => {
                t(i, e) && this.delete(i);
            }));
        }
        resolve(t) {
            const {url: e} = l.fromUrl(t);
            return this.swup.resolveUrl(e);
        }
    }
    const p = (t, e = document) => e.querySelector(t), m = (t, e = document) => Array.from(e.querySelectorAll(t)), w = () => new Promise((t => {
        requestAnimationFrame((() => {
            requestAnimationFrame((() => {
                t();
            }));
        }));
    }));
    function f(t) {
        return !!t && ("object" == typeof t || "function" == typeof t) && "function" == typeof t.then;
    }
    function g(t, e = []) {
        return new Promise(((i, s) => {
            const n = t(...e);
            f(n) ? n.then(i, s) : i(n);
        }));
    }
    function y(t, e) {
        const i = null == t ? void 0 : t.closest(`[${e}]`);
        return null != i && i.hasAttribute(e) ? (null == i ? void 0 : i.getAttribute(e)) || !0 : void 0;
    }
    class k {
        constructor(t) {
            this.swup = void 0, this.swupClasses = [ "to-", "is-changing", "is-rendering", "is-popstate", "is-animating", "is-leaving" ], 
            this.swup = t;
        }
        get selectors() {
            const {scope: t} = this.swup.visit.animation;
            return "containers" === t ? this.swup.visit.containers : "html" === t ? [ "html" ] : Array.isArray(t) ? t : [];
        }
        get selector() {
            return this.selectors.join(",");
        }
        get targets() {
            return this.selector.trim() ? m(this.selector) : [];
        }
        add(...t) {
            this.targets.forEach((e => e.classList.add(...t)));
        }
        remove(...t) {
            this.targets.forEach((e => e.classList.remove(...t)));
        }
        clear() {
            this.targets.forEach((t => {
                const e = t.className.split(" ").filter((t => this.isSwupClass(t)));
                t.classList.remove(...e);
            }));
        }
        isSwupClass(t) {
            return this.swupClasses.some((e => t.startsWith(e)));
        }
    }
    class b {
        constructor(t, e) {
            this.id = void 0, this.state = void 0, this.from = void 0, this.to = void 0, this.containers = void 0, 
            this.animation = void 0, this.trigger = void 0, this.cache = void 0, this.history = void 0, 
            this.scroll = void 0, this.meta = void 0;
            const {to: i, from: s, hash: n, el: o, event: r} = e;
            this.id = Math.random(), this.state = 1, this.from = {
                url: null != s ? s : t.location.url,
                hash: t.location.hash
            }, this.to = {
                url: i,
                hash: n
            }, this.containers = t.options.containers, this.animation = {
                animate: !0,
                wait: !1,
                name: void 0,
                native: t.options.native,
                scope: t.options.animationScope,
                selector: t.options.animationSelector
            }, this.trigger = {
                el: o,
                event: r
            }, this.cache = {
                read: t.options.cache,
                write: t.options.cache
            }, this.history = {
                action: "push",
                popstate: !1,
                direction: void 0
            }, this.scroll = {
                reset: !0,
                target: void 0
            }, this.meta = {};
        }
        advance(t) {
            this.state < t && (this.state = t);
        }
        abort() {
            this.state = 8;
        }
        get done() {
            return this.state >= 7;
        }
    }
    function S(t) {
        return new b(this, t);
    }
    class E {
        constructor(t) {
            this.swup = void 0, this.registry = new Map, this.hooks = [ "animation:out:start", "animation:out:await", "animation:out:end", "animation:in:start", "animation:in:await", "animation:in:end", "animation:skip", "cache:clear", "cache:set", "content:replace", "content:scroll", "enable", "disable", "fetch:request", "fetch:error", "fetch:timeout", "history:popstate", "link:click", "link:self", "link:anchor", "link:newtab", "page:load", "page:view", "scroll:top", "scroll:anchor", "visit:start", "visit:transition", "visit:abort", "visit:end" ], 
            this.swup = t, this.init();
        }
        init() {
            this.hooks.forEach((t => this.create(t)));
        }
        create(t) {
            this.registry.has(t) || this.registry.set(t, new Map);
        }
        exists(t) {
            return this.registry.has(t);
        }
        get(t) {
            const e = this.registry.get(t);
            if (e) return e;
            console.error(`Unknown hook '${t}'`);
        }
        clear() {
            this.registry.forEach((t => t.clear()));
        }
        on(t, e, s = {}) {
            const n = this.get(t);
            if (!n) return console.warn(`Hook '${t}' not found.`), () => {};
            const o = i({}, s, {
                id: n.size + 1,
                hook: t,
                handler: e
            });
            return n.set(e, o), () => this.off(t, e);
        }
        before(t, e, s = {}) {
            return this.on(t, e, i({}, s, {
                before: !0
            }));
        }
        replace(t, e, s = {}) {
            return this.on(t, e, i({}, s, {
                replace: !0
            }));
        }
        once(t, e, s = {}) {
            return this.on(t, e, i({}, s, {
                once: !0
            }));
        }
        off(t, e) {
            const i = this.get(t);
            i && e ? i.delete(e) || console.warn(`Handler for hook '${t}' not found.`) : i && i.clear();
        }
        async call(t, e, i, s) {
            const [n, o, r] = this.parseCallArgs(t, e, i, s), {before: a, handler: l, after: h} = this.getHandlers(t, r);
            await this.run(a, n, o);
            const [c] = await this.run(l, n, o, !0);
            return await this.run(h, n, o), this.dispatchDomEvent(t, n, o), c;
        }
        callSync(t, e, i, s) {
            const [n, o, r] = this.parseCallArgs(t, e, i, s), {before: a, handler: l, after: h} = this.getHandlers(t, r);
            this.runSync(a, n, o);
            const [c] = this.runSync(l, n, o, !0);
            return this.runSync(h, n, o), this.dispatchDomEvent(t, n, o), c;
        }
        parseCallArgs(t, e, i, s) {
            return e instanceof b || "object" != typeof e && "function" != typeof i ? [ e, i, s ] : [ void 0, e, i ];
        }
        async run(t, e = this.swup.visit, i, s = !1) {
            const n = [];
            for (const {hook: o, handler: r, defaultHandler: a, once: l} of t) if (null == e || !e.done) {
                l && this.off(o, r);
                try {
                    const t = await g(r, [ e, i, a ]);
                    n.push(t);
                } catch (t) {
                    if (s) throw t;
                    console.error(`Error in hook '${o}':`, t);
                }
            }
            return n;
        }
        runSync(t, e = this.swup.visit, i, s = !1) {
            const n = [];
            for (const {hook: o, handler: r, defaultHandler: a, once: l} of t) if (null == e || !e.done) {
                l && this.off(o, r);
                try {
                    const t = r(e, i, a);
                    n.push(t), f(t) && console.warn(`Swup will not await Promises in handler for synchronous hook '${o}'.`);
                } catch (t) {
                    if (s) throw t;
                    console.error(`Error in hook '${o}':`, t);
                }
            }
            return n;
        }
        getHandlers(t, e) {
            const i = this.get(t);
            if (!i) return {
                found: !1,
                before: [],
                handler: [],
                after: [],
                replaced: !1
            };
            const s = Array.from(i.values()), n = this.sortRegistrations, o = s.filter((({before: t, replace: e}) => t && !e)).sort(n), r = s.filter((({replace: t}) => t)).filter((t => !0)).sort(n), a = s.filter((({before: t, replace: e}) => !t && !e)).sort(n), l = r.length > 0;
            let h = [];
            if (e && (h = [ {
                id: 0,
                hook: t,
                handler: e
            } ], l)) {
                const i = r.length - 1, {handler: s, once: n} = r[i], o = t => {
                    const i = r[t - 1];
                    return i ? (e, s) => i.handler(e, s, o(t - 1)) : e;
                };
                h = [ {
                    id: 0,
                    hook: t,
                    once: n,
                    handler: s,
                    defaultHandler: o(i)
                } ];
            }
            return {
                found: !0,
                before: o,
                handler: h,
                after: a,
                replaced: l
            };
        }
        sortRegistrations(t, e) {
            var i, s;
            return (null != (i = t.priority) ? i : 0) - (null != (s = e.priority) ? s : 0) || t.id - e.id || 0;
        }
        dispatchDomEvent(t, e, i) {
            if (null != e && e.done) return;
            const s = {
                hook: t,
                args: i,
                visit: e || this.swup.visit
            };
            document.dispatchEvent(new CustomEvent("swup:any", {
                detail: s,
                bubbles: !0
            })), document.dispatchEvent(new CustomEvent(`swup:${t}`, {
                detail: s,
                bubbles: !0
            }));
        }
        parseName(t) {
            const [e, ...s] = t.split(".");
            return [ e, s.reduce(((t, e) => i({}, t, {
                [e]: !0
            })), {}) ];
        }
    }
    const C = t => {
        if (t && "#" === t.charAt(0) && (t = t.substring(1)), !t) return null;
        const e = decodeURIComponent(t);
        let i = document.getElementById(t) || document.getElementById(e) || p(`a[name='${CSS.escape(t)}']`) || p(`a[name='${CSS.escape(e)}']`);
        return i || "top" !== t || (i = document.body), i;
    }, U = "transition", P = "animation";
    async function $({selector: t, elements: e}) {
        if (!1 === t && !e) return;
        let i = [];
        if (e) i = Array.from(e); else if (t && (i = m(t, document.body), !i.length)) return void console.warn(`[swup] No elements found matching animationSelector \`${t}\``);
        const s = i.map((t => function(t) {
            const {type: e, timeout: i, propCount: s} = function(t) {
                const e = window.getComputedStyle(t), i = A(e, `${U}Delay`), s = A(e, `${U}Duration`), n = x(i, s), o = A(e, `${P}Delay`), r = A(e, `${P}Duration`), a = x(o, r), l = Math.max(n, a), h = l > 0 ? n > a ? U : P : null;
                return {
                    type: h,
                    timeout: l,
                    propCount: h ? h === U ? s.length : r.length : 0
                };
            }(t);
            return !(!e || !i) && new Promise((n => {
                const o = `${e}end`, r = performance.now();
                let a = 0;
                const l = () => {
                    t.removeEventListener(o, h), n();
                }, h = e => {
                    e.target === t && ((performance.now() - r) / 1e3 < e.elapsedTime || ++a >= s && l());
                };
                setTimeout((() => {
                    a < s && l();
                }), i + 1), t.addEventListener(o, h);
            }));
        }(t)));
        s.filter(Boolean).length > 0 ? await Promise.all(s) : t && console.warn(`[swup] No CSS animation duration defined on elements matching \`${t}\``);
    }
    function A(t, e) {
        return (t[e] || "").split(", ");
    }
    function x(t, e) {
        for (;t.length < e.length; ) t = t.concat(t);
        return Math.max(...e.map(((e, i) => H(e) + H(t[i]))));
    }
    function H(t) {
        return 1e3 * parseFloat(t);
    }
    function V(t, e = {}, s = {}) {
        if ("string" != typeof t) throw new Error("swup.navigate() requires a URL parameter");
        if (this.shouldIgnoreVisit(t, {
            el: s.el,
            event: s.event
        })) return void window.location.assign(t);
        const {url: n, hash: o} = l.fromUrl(t), r = this.createVisit(i({}, s, {
            to: n,
            hash: o
        }));
        this.performNavigation(r, e);
    }
    async function I(t, e = {}) {
        if (this.navigating) {
            if (this.visit.state >= 6) return t.state = 2, void (this.onVisitEnd = () => this.performNavigation(t, e));
            await this.hooks.call("visit:abort", this.visit, void 0), delete this.visit.to.document, 
            this.visit.state = 8;
        }
        this.navigating = !0, this.visit = t;
        const {el: i} = t.trigger;
        e.referrer = e.referrer || this.location.url, !1 === e.animate && (t.animation.animate = !1), 
        t.animation.animate || this.classes.clear();
        const n = e.history || y(i, "data-swup-history");
        "string" == typeof n && [ "push", "replace" ].includes(n) && (t.history.action = n);
        const a = e.animation || y(i, "data-swup-animation");
        var h, c;
        "string" == typeof a && (t.animation.name = a), t.meta = e.meta || {}, "object" == typeof e.cache ? (t.cache.read = null != (h = e.cache.read) ? h : t.cache.read, 
        t.cache.write = null != (c = e.cache.write) ? c : t.cache.write) : void 0 !== e.cache && (t.cache = {
            read: !!e.cache,
            write: !!e.cache
        }), delete e.cache;
        try {
            await this.hooks.call("visit:start", t, void 0), t.state = 3;
            const i = this.hooks.call("page:load", t, {
                options: e
            }, (async (t, e) => {
                let i;
                return t.cache.read && (i = this.cache.get(t.to.url)), e.page = i || await this.fetchPage(t.to.url, e.options), 
                e.cache = !!i, e.page;
            }));
            i.then((({html: e}) => {
                t.advance(5), t.to.html = e, t.to.document = (new DOMParser).parseFromString(e, "text/html");
            }));
            const n = t.to.url + t.to.hash;
            if (t.history.popstate || ("replace" === t.history.action || t.to.url === this.location.url ? r(n) : (this.currentHistoryIndex++, 
            o(n, {
                index: this.currentHistoryIndex
            }))), this.location = l.fromUrl(n), t.history.popstate && this.classes.add("is-popstate"), 
            t.animation.name && this.classes.add(`to-${s(t.animation.name)}`), t.animation.wait && await i, 
            t.done) return;
            if (await this.hooks.call("visit:transition", t, void 0, (async () => {
                if (!t.animation.animate) return await this.hooks.call("animation:skip", void 0), 
                void await this.renderPage(t, await i);
                t.advance(4), await this.animatePageOut(t), t.animation.native && document.startViewTransition ? await document.startViewTransition((async () => await this.renderPage(t, await i))).finished : await this.renderPage(t, await i), 
                await this.animatePageIn(t);
            })), t.done) return;
            await this.hooks.call("visit:end", t, void 0, (() => this.classes.clear())), t.state = 7, 
            this.navigating = !1, this.onVisitEnd && (this.onVisitEnd(), this.onVisitEnd = void 0);
        } catch (e) {
            if (!e || null != e && e.aborted) return void (t.state = 8);
            t.state = 9, console.error(e), this.options.skipPopStateHandling = () => (window.location.assign(t.to.url + t.to.hash), 
            !0), window.history.back();
        } finally {
            delete t.to.document;
        }
    }
    const L = async function(t) {
        await this.hooks.call("animation:out:start", t, void 0, (() => {
            this.classes.add("is-changing", "is-animating", "is-leaving");
        })), await this.hooks.call("animation:out:await", t, {
            skip: !1
        }, ((t, {skip: e}) => {
            if (!e) return this.awaitAnimations({
                selector: t.animation.selector
            });
        })), await this.hooks.call("animation:out:end", t, void 0);
    }, q = function(t) {
        var e;
        const i = t.to.document;
        if (!i) return !1;
        const s = (null == (e = i.querySelector("title")) ? void 0 : e.innerText) || "";
        document.title = s;
        const n = m('[data-swup-persist]:not([data-swup-persist=""])'), o = t.containers.map((t => {
            const e = document.querySelector(t), s = i.querySelector(t);
            return e && s ? (e.replaceWith(s.cloneNode(!0)), !0) : (e || console.warn(`[swup] Container missing in current document: ${t}`), 
            s || console.warn(`[swup] Container missing in incoming document: ${t}`), !1);
        })).filter(Boolean);
        return n.forEach((t => {
            const e = t.getAttribute("data-swup-persist"), i = p(`[data-swup-persist="${e}"]`);
            i && i !== t && i.replaceWith(t);
        })), o.length === t.containers.length;
    }, R = function(t) {
        const e = {
            behavior: "auto"
        }, {target: s, reset: n} = t.scroll, o = null != s ? s : t.to.hash;
        let r = !1;
        return o && (r = this.hooks.callSync("scroll:anchor", t, {
            hash: o,
            options: e
        }, ((t, {hash: e, options: i}) => {
            const s = this.getAnchorElement(e);
            return s && s.scrollIntoView(i), !!s;
        }))), n && !r && (r = this.hooks.callSync("scroll:top", t, {
            options: e
        }, ((t, {options: e}) => (window.scrollTo(i({
            top: 0,
            left: 0
        }, e)), !0)))), r;
    }, T = async function(t) {
        if (t.done) return;
        const e = this.hooks.call("animation:in:await", t, {
            skip: !1
        }, ((t, {skip: e}) => {
            if (!e) return this.awaitAnimations({
                selector: t.animation.selector
            });
        }));
        await w(), await this.hooks.call("animation:in:start", t, void 0, (() => {
            this.classes.remove("is-animating");
        })), await e, await this.hooks.call("animation:in:end", t, void 0);
    }, N = async function(t, e) {
        if (t.done) return;
        t.advance(6);
        const {url: i} = e;
        this.isSameResolvedUrl(n(), i) || (r(i), this.location = l.fromUrl(i), t.to.url = this.location.url, 
        t.to.hash = this.location.hash), await this.hooks.call("content:replace", t, {
            page: e
        }, ((t, {}) => {
            if (this.classes.remove("is-leaving"), t.animation.animate && this.classes.add("is-rendering"), 
            !this.replaceContent(t)) throw new Error("[swup] Container mismatch, aborting");
            t.animation.animate && (this.classes.add("is-changing", "is-animating", "is-rendering"), 
            t.animation.name && this.classes.add(`to-${s(t.animation.name)}`));
        })), await this.hooks.call("content:scroll", t, void 0, (() => this.scrollToContent(t))), 
        await this.hooks.call("page:view", t, {
            url: this.location.url,
            title: document.title
        });
    }, O = function(t) {
        var e;
        if (e = t, Boolean(null == e ? void 0 : e.isSwupPlugin)) {
            if (t.swup = this, !t._checkRequirements || t._checkRequirements()) return t._beforeMount && t._beforeMount(), 
            t.mount(), this.plugins.push(t), this.plugins;
        } else console.error("Not a swup plugin instance", t);
    };
    function D(t) {
        const e = this.findPlugin(t);
        if (e) return e.unmount(), e._afterUnmount && e._afterUnmount(), this.plugins = this.plugins.filter((t => t !== e)), 
        this.plugins;
        console.error("No such plugin", e);
    }
    function M(t) {
        return this.plugins.find((e => e === t || e.name === t || e.name === `Swup${String(t)}`));
    }
    function W(t) {
        if ("function" != typeof this.options.resolveUrl) return console.warn("[swup] options.resolveUrl expects a callback function."), 
        t;
        const e = this.options.resolveUrl(t);
        return e && "string" == typeof e ? e.startsWith("//") || e.startsWith("http") ? (console.warn("[swup] options.resolveUrl needs to return a relative url"), 
        t) : e : (console.warn("[swup] options.resolveUrl needs to return a url"), t);
    }
    function B(t, e) {
        return this.resolveUrl(t) === this.resolveUrl(e);
    }
    const j = {
        animateHistoryBrowsing: !1,
        animationSelector: '[class*="transition-"]',
        animationScope: "html",
        cache: !0,
        containers: [ "#swup" ],
        hooks: {},
        ignoreVisit: (t, {el: e} = {}) => !(null == e || !e.closest("[data-no-swup]")),
        linkSelector: "a[href]",
        linkToSelf: "scroll",
        native: !1,
        plugins: [],
        resolveUrl: t => t,
        requestHeaders: {
            "X-Requested-With": "swup",
            Accept: "text/html, application/xhtml+xml"
        },
        skipPopStateHandling: t => {
            var e;
            return "swup" !== (null == (e = t.state) ? void 0 : e.source);
        },
        timeout: 0
    };
    class _ {
        get currentPageUrl() {
            return this.location.url;
        }
        constructor(t = {}) {
            var e, s;
            this.version = "4.8.2", this.options = void 0, this.defaults = j, this.plugins = [], 
            this.visit = void 0, this.cache = void 0, this.hooks = void 0, this.classes = void 0, 
            this.location = l.fromUrl(window.location.href), this.currentHistoryIndex = void 0, 
            this.clickDelegate = void 0, this.navigating = !1, this.onVisitEnd = void 0, this.use = O, 
            this.unuse = D, this.findPlugin = M, this.log = () => {}, this.navigate = V, this.performNavigation = I, 
            this.createVisit = S, this.delegateEvent = a, this.fetchPage = u, this.awaitAnimations = $, 
            this.renderPage = N, this.replaceContent = q, this.animatePageIn = T, this.animatePageOut = L, 
            this.scrollToContent = R, this.getAnchorElement = C, this.getCurrentUrl = n, this.resolveUrl = W, 
            this.isSameResolvedUrl = B, this.options = i({}, this.defaults, t), this.handleLinkClick = this.handleLinkClick.bind(this), 
            this.handlePopState = this.handlePopState.bind(this), this.cache = new d(this), 
            this.classes = new k(this), this.hooks = new E(this), this.visit = this.createVisit({
                to: ""
            }), this.currentHistoryIndex = null != (e = null == (s = window.history.state) ? void 0 : s.index) ? e : 1, 
            this.enable();
        }
        async enable() {
            var t;
            const {linkSelector: e} = this.options;
            this.clickDelegate = this.delegateEvent(e, "click", this.handleLinkClick), window.addEventListener("popstate", this.handlePopState), 
            this.options.animateHistoryBrowsing && (window.history.scrollRestoration = "manual"), 
            this.options.native = this.options.native && !!document.startViewTransition, this.options.plugins.forEach((t => this.use(t)));
            for (const [t, e] of Object.entries(this.options.hooks)) {
                const [i, s] = this.hooks.parseName(t);
                this.hooks.on(i, e, s);
            }
            "swup" !== (null == (t = window.history.state) ? void 0 : t.source) && r(null, {
                index: this.currentHistoryIndex
            }), await w(), await this.hooks.call("enable", void 0, void 0, (() => {
                const t = document.documentElement;
                t.classList.add("swup-enabled"), t.classList.toggle("swup-native", this.options.native);
            }));
        }
        async destroy() {
            this.clickDelegate.destroy(), window.removeEventListener("popstate", this.handlePopState), 
            this.cache.clear(), this.options.plugins.forEach((t => this.unuse(t))), await this.hooks.call("disable", void 0, void 0, (() => {
                const t = document.documentElement;
                t.classList.remove("swup-enabled"), t.classList.remove("swup-native");
            })), this.hooks.clear();
        }
        shouldIgnoreVisit(t, {el: e, event: i} = {}) {
            const {origin: s, url: n, hash: o} = l.fromUrl(t);
            return s !== window.location.origin || !(!e || !this.triggerWillOpenNewWindow(e)) || !!this.options.ignoreVisit(n + o, {
                el: e,
                event: i
            });
        }
        handleLinkClick(t) {
            const e = t.delegateTarget, {href: i, url: s, hash: n} = l.fromElement(e);
            if (this.shouldIgnoreVisit(i, {
                el: e,
                event: t
            })) return;
            if (this.navigating && s === this.visit.to.url) return void t.preventDefault();
            const o = this.createVisit({
                to: s,
                hash: n,
                el: e,
                event: t
            });
            t.metaKey || t.ctrlKey || t.shiftKey || t.altKey ? this.hooks.callSync("link:newtab", o, {
                href: i
            }) : 0 === t.button && this.hooks.callSync("link:click", o, {
                el: e,
                event: t
            }, (() => {
                var e;
                const i = null != (e = o.from.url) ? e : "";
                t.preventDefault(), s && s !== i ? this.isSameResolvedUrl(s, i) || this.performNavigation(o) : n ? this.hooks.callSync("link:anchor", o, {
                    hash: n
                }, (() => {
                    r(s + n), this.scrollToContent(o);
                })) : this.hooks.callSync("link:self", o, void 0, (() => {
                    "navigate" === this.options.linkToSelf ? this.performNavigation(o) : (r(s), this.scrollToContent(o));
                }));
            }));
        }
        handlePopState(t) {
            var e, i, s, o;
            const r = null != (e = null == (i = t.state) ? void 0 : i.url) ? e : window.location.href;
            if (this.options.skipPopStateHandling(t)) return;
            if (this.isSameResolvedUrl(n(), this.location.url)) return;
            const {url: a, hash: h} = l.fromUrl(r), c = this.createVisit({
                to: a,
                hash: h,
                event: t
            });
            c.history.popstate = !0;
            const u = null != (s = null == (o = t.state) ? void 0 : o.index) ? s : 0;
            u && u !== this.currentHistoryIndex && (c.history.direction = u - this.currentHistoryIndex > 0 ? "forwards" : "backwards", 
            this.currentHistoryIndex = u), c.animation.animate = !1, c.scroll.reset = !1, c.scroll.target = !1, 
            this.options.animateHistoryBrowsing && (c.animation.animate = !0, c.scroll.reset = !0), 
            this.hooks.callSync("history:popstate", c, {
                event: t
            }, (() => {
                this.performNavigation(c);
            }));
        }
        triggerWillOpenNewWindow(t) {
            return !!t.matches('[download], [target="_blank"]');
        }
    }
    const swup = new _({
        animationSelector: "#swup"
    });
    function handleLogo() {
        const pageType = document.getElementById("swup").dataset.page;
        const logo = document.querySelector(".header__logo");
        if (logo) if (pageType === "home") gsap.to(logo, {
            opacity: 0,
            pointerEvents: "none",
            duration: 0
        }); else gsap.to(logo, {
            opacity: 1,
            pointerEvents: "all",
            duration: .3
        });
    }
    swup.hooks.replace("animation:out:await", (async () => {
        console.log("ANIMATION OUT");
        await gsap.to("#swup", {
            opacity: 0,
            y: 50,
            duration: .5
        });
    }));
    swup.hooks.replace("animation:in:await", (async () => {
        console.log("ANIMATION IN");
        gsap.set("#swup", {
            opacity: 0,
            y: 50
        });
        handleLogo();
        initPageAnimations();
        await gsap.to("#swup", {
            opacity: 1,
            y: 0,
            duration: .5
        });
        ScrollTrigger.refresh();
    }));
    function setupGlobalEvents() {
        document.addEventListener("click", (function(e) {
            const targetElement = e.target;
            if (document.documentElement.classList.contains("menu-open") && !targetElement.closest(".menu__body")) {
                bodyLockToggle();
                document.documentElement.classList.remove("menu-open");
            }
        }));
        const header = document.querySelector(".header");
        function handleScroll() {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            const screenHeight = window.innerHeight;
            const scrollRatio = scrollPosition / screenHeight;
            header.classList.toggle("_scrolled2", scrollRatio > .67);
            header.classList.toggle("_scrolled", scrollRatio > .8);
            header.classList.toggle("_show", scrollRatio > 1);
        }
        const throttledScroll = throttle(handleScroll, 100);
        window.addEventListener("scroll", throttledScroll);
        function throttle(func, limit) {
            let lastFunc;
            let lastRan;
            return function() {
                const context = this;
                const args = arguments;
                if (!lastRan) {
                    func.apply(context, args);
                    lastRan = Date.now();
                } else {
                    clearTimeout(lastFunc);
                    lastFunc = setTimeout((function() {
                        if (Date.now() - lastRan >= limit) {
                            func.apply(context, args);
                            lastRan = Date.now();
                        }
                    }), limit - (Date.now() - lastRan));
                }
            };
        }
        function initLinkHoverEffects() {
            const links = gsap.utils.toArray(".link-up");
            links.forEach((link => {
                gsap.set(link, {
                    y: 0
                });
                link.addEventListener("mouseenter", (() => {
                    gsap.to(link, {
                        y: -5,
                        duration: .3,
                        ease: "power2.out"
                    });
                }));
                link.addEventListener("mouseleave", (() => {
                    gsap.to(link, {
                        y: 0,
                        duration: .5,
                        ease: "elastic.out(1, 0.5)"
                    });
                }));
            }));
        }
        initLinkHoverEffects();
    }
    function initPageAnimations(container = document) {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isMobile = window.innerWidth <= 767.98;
        const isScrolled = window.scrollY > window.innerHeight / 4;
        document.fonts.ready.then((() => {
            initAnimations(isScrolled, container);
        })).catch((() => {
            setTimeout((() => initAnimations(isScrolled, container)), 300);
        }));
        function initAnimations(isScrolled, container) {
            const masterTimeline = gsap.timeline();
            const firstScreen = container.querySelector(".firstscreen");
            if (firstScreen && !prefersReducedMotion && !isMobile) {
                const heroTimeline = gsap.timeline({
                    defaults: {
                        ease: "power3.out",
                        duration: .5
                    }
                });
                masterTimeline.add(heroTimeline);
                const firstScreenTitle = firstScreen.querySelector(".firstscreen__title");
                if (firstScreenTitle) {
                    const splitTitle = new SplitText(firstScreenTitle, {
                        type: "chars,lines",
                        linesClass: "line-wrapper"
                    });
                    heroTimeline.from(splitTitle.chars, {
                        y: 20,
                        opacity: 0,
                        stagger: .05,
                        ease: "back.out(1.7)"
                    });
                }
                const helloText = firstScreen.querySelector(".firstscreen__hello");
                if (helloText) {
                    const splitHello = new SplitText(helloText, {
                        type: "words,lines",
                        linesClass: "hello-line"
                    });
                    heroTimeline.from(splitHello.words, {
                        y: 20,
                        opacity: 0,
                        stagger: .1,
                        duration: .3
                    }, "-=0.4");
                }
                const image = firstScreen.querySelector(".firstscreen__image");
                if (image) heroTimeline.from(image, {
                    scale: .8,
                    opacity: 0,
                    filter: "blur(5px)",
                    duration: 1.5,
                    ease: "elastic.out(1, 0.5)"
                }, "-=0.3");
                const header = container.querySelector(".header");
                if (header && !header.classList.contains("_scrolled2")) {
                    const menuItems = container.querySelectorAll(".header__row .menu__body ul li");
                    if (menuItems.length > 0) heroTimeline.from(menuItems, {
                        y: -20,
                        opacity: 0,
                        stagger: .2,
                        duration: .3,
                        ease: "back.out(1.2)"
                    }, "-=1");
                }
            } else if (firstScreen) {
                const simpleHeroTimeline = gsap.timeline();
                masterTimeline.add(simpleHeroTimeline);
                const elements = [].filter.call(firstScreen.querySelectorAll(".firstscreen__title, .firstscreen__image, .firstscreen__hello"), (el => !!el));
                if (elements.length > 0) simpleHeroTimeline.from(elements, {
                    duration: .6,
                    y: -20,
                    opacity: 0,
                    stagger: .3,
                    ease: "power1.out"
                });
            }
            function animateTitle(element) {
                gsap.to(element, {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: element,
                        start: "top bottom",
                        once: true
                    }
                });
                const splitTitle = new SplitText(element, {
                    type: "chars,lines",
                    linesClass: "cases-title-line"
                });
                gsap.from(splitTitle.chars, {
                    opacity: 0,
                    y: 20,
                    duration: .4,
                    stagger: .05,
                    ease: "back.out(1.7)",
                    onComplete: () => splitTitle.revert(),
                    scrollTrigger: {
                        trigger: element,
                        start: "top 90%",
                        once: true
                    }
                });
            }
            const casesTitle = container.querySelector(".cases-title");
            if (casesTitle) if (!isScrolled && firstScreen) masterTimeline.add((() => animateTitle(casesTitle)), "-=1"); else animateTitle(casesTitle);
            function animateCaseItems(items) {
                items.forEach(((item, index) => {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: .6,
                        delay: index % 2 * .15,
                        ease: "back.out(1.2)",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 90%",
                            once: true
                        }
                    });
                }));
            }
            const caseItems = gsap.utils.toArray(container.querySelectorAll(".case-item"));
            if (caseItems.length > 0) if (!isScrolled && firstScreen) masterTimeline.add((() => animateCaseItems(caseItems)), "-=0.3"); else animateCaseItems(caseItems);
            function animateButton(element) {
                gsap.to(element, {
                    opacity: 1,
                    y: 0,
                    duration: .8,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 90%",
                        once: true
                    }
                });
            }
            const casesButton = container.querySelector(".widget-cases__button");
            if (casesButton) if (!isScrolled) masterTimeline.add((() => animateButton(casesButton))); else animateButton(casesButton);
        }
        function initAboutAnimations() {
            gsap.set([ ...container.querySelectorAll(".widget-about__caption"), ...container.querySelectorAll(".widget-about__text"), ...container.querySelectorAll(".firstscreen__features .firstscreen__column"), ...container.querySelectorAll(".widget-about__item") ], {
                opacity: 0
            });
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.querySelector(".widget-about"),
                    start: "top 80%",
                    once: true
                }
            });
            tl.fromTo(container.querySelector(".widget-about__caption"), {
                xPercent: 30,
                opacity: 0
            }, {
                xPercent: 0,
                opacity: 1,
                duration: .7
            }).fromTo(container.querySelector(".widget-about__text"), {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: .7
            }, "-=0.5").fromTo(container.querySelectorAll(".firstscreen__features .firstscreen__column"), {
                y: 50,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: .6,
                stagger: .2
            }, "-=0.3").fromTo(container.querySelectorAll(".widget-about__item"), {
                x: i => i % 2 ? -50 : 50,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                stagger: .2,
                duration: .6
            }, "-=0.4");
        }
        if (container.querySelector(".widget-about")) initAboutAnimations();
        function initFooterAnimations() {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.querySelector(".footer"),
                    start: "top 95%",
                    once: true
                }
            });
            const footerCaption = container.querySelector(".footer__caption");
            if (footerCaption) {
                const splitCaption = new SplitText(footerCaption, {
                    type: "chars,lines",
                    linesClass: "cases-title-line"
                });
                tl.from(splitCaption.chars, {
                    opacity: 0,
                    y: 20,
                    duration: .4,
                    stagger: .05,
                    ease: "back.out(1.7)",
                    onComplete: () => splitCaption.revert()
                });
            }
            tl.from(container.querySelectorAll(".footer .menu-contacts__item"), {
                y: -40,
                opacity: 0,
                duration: .6,
                stagger: .15,
                ease: "bounce.out"
            }, "-=0.3");
        }
        document.fonts.ready.then((() => {
            initFooterAnimations();
        }));
        container.querySelectorAll(".ripple-button").forEach((btn => {
            const fillEffect = document.createElement("span");
            fillEffect.classList.add("fill-effect");
            btn.insertBefore(fillEffect, btn.firstChild);
            btn.addEventListener("mousemove", (e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                fillEffect.style.left = `${x}px`;
                fillEffect.style.top = `${y}px`;
            }));
            btn.addEventListener("mouseleave", (e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                fillEffect.style.left = `${x}px`;
                fillEffect.style.top = `${y}px`;
                fillEffect.style.width = "0";
                fillEffect.style.height = "0";
            }));
        }));
        container.querySelectorAll(".js-magnetic-img").forEach((preview => {
            const img = preview.querySelector("img");
            const strength = 25;
            let rafId;
            const scaleNormal = 1;
            const scaleHover = .96;
            const transitionSpeed = .7;
            img.style.transition = `\n      transform ${transitionSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94),\n      scale ${transitionSpeed}s ease-out\n    `;
            img.style.willChange = "transform";
            preview.addEventListener("mouseenter", (() => {
                img.style.transform = `scale(${scaleHover})`;
            }));
            const moveImg = e => {
                cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame((() => {
                    const rect = preview.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - .5;
                    const y = (e.clientY - rect.top) / rect.height - .5;
                    img.style.transform = `\n          scale(${scaleHover})\n          translate(${x * strength}px, ${y * strength}px)\n          rotateX(${-y * 5}deg)\n          rotateY(${x * 5}deg)\n        `;
                }));
            };
            const resetImg = () => {
                cancelAnimationFrame(rafId);
                img.style.transform = `scale(${scaleNormal})`;
            };
            preview.addEventListener("mousemove", moveImg);
            preview.addEventListener("mouseleave", resetImg);
        }));
    }
    document.addEventListener("DOMContentLoaded", (() => {
        gsap.registerPlugin(SplitText, ScrollTrigger);
        setupGlobalEvents();
        initPageAnimations();
        handleLogo();
        ScrollTrigger.refresh();
    }));
    window["FLS"] = false;
    menuInit();
})();