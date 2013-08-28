'use strict';

// Common UI Library
var support = {
    translate3d: ('WebKitCSSMatrix'in window&&'m11'in new WebKitCSSMatrix())
};

(function(global, document){
var ns = global.ui = {},
    i,
    il;
ns.translateX = function(elm, x, duration){
    var style = elm.style,
        prop = support.translate3d
        ? 'translate3d(' + x +'px, 0, 0)'
        : 'translateX(' + x +'px)';
    style.transform =
    style.webkitTransform =
    style.MozTransform =
    style.OTransform =
    prop;
    style.transitionDuration =
    style.webkitTransitionDuration =
    style.MozTransitionDuration =
    style.OTransitionDuration =
    duration;
}
ns.preventDefault = function(){
    event.preventDefault();
}
})(this, this.document);

// Carousel
(function(global, document){
var ns = global.ui,
    i,
    il;
ns.Carousel = function(){
    this.init.apply(this, arguments);
}
var fn = ns.Carousel.prototype;

fn.init = function(element, opt){
    var self = this;
    self.element = element;
    if (typeof element === 'string') {
        self.element = document.querySelector(element);
    }
    self.liWrapElm = self.element.querySelector(opt.liWrapElm);
    self.liElms = self.element.querySelectorAll(opt.liElms);
    self.liWidth = opt.liWidth;
    self.liIndex = opt.liIndex || 0;
    self.flick = (opt.flick == false) ? false : true;
    self.navElms = self.element.querySelectorAll(opt.navElms);
    self.prevBtnElm = self.element.querySelector(opt.prevBtnElm);
    self.nextBtnElm = self.element.querySelector(opt.nextBtnElm);
    self.autoPlayInterval = opt.autoPlayInterval;

    self.move(self.liIndex);
    if(self.flick){
        self.activateFlick();
    }
    if(self.autoPlayInterval){
        self.activateAutoPlay();
    }
    if(self.prevBtnElm || self.nextBtnElm){
        self.activateNav();
    }
    if(opt.debugMode == true){
        self.debug();
    }
}
fn.activateFlick = function(){
    var self = this;
    self.liWrapElm.addEventListener('touchstart', function(){
        self.touchstartX = event.touches[0].pageX;
        self.swipe();
        if(self.autoPlayInterval)self.autoPlay_stop();
    }, false);
    self.liWrapElm.addEventListener('touchmove', function(){
        self.touchmoveX = event.touches[0].pageX;
    }, false);
    self.liWrapElm.addEventListener('touchend', function(){
        self.touchendX = event.changedTouches[0].pageX;
        if(self.autoPlayInterval)self.autoPlay();
    }, false);
}
fn.activateAutoPlay = function(){
    var self = this;
    self.autoPlay = function(){
        self.control = setInterval(function(){
            if(self.liIndex < self.liElms.length - 1){
                self.next();
            }else{
                self.liIndex = 0;
                self.move(0);
            }
        }, self.autoPlayInterval);
    }
    self.autoPlay_stop = function(){
        clearInterval(self.control);
    }
    self.autoPlay();
}
fn.activateNav = function(){
    var self = this;
    self.prevBtnElm.addEventListener('touchstart', self.autoPlay_stop, false);
    self.nextBtnElm.addEventListener('touchstart', self.autoPlay_stop, false);
    self.prevBtnElm.addEventListener('touchend', function(){
        self.prev();
        if(self.autoPlayInterval)self.autoPlay();
    }, false);
    self.nextBtnElm.addEventListener('touchend', function(){
        self.next();
        if(self.autoPlayInterval)self.autoPlay();
    }, false);
}

fn.prev = function(){
    var self = this;
    if(self.liIndex > 0){
        self.liIndex--;
        self.move(self.liIndex);
    }else{
        self.move(self.liIndex);
    }
}

fn.next = function(){
    var self = this;
    if(self.liIndex < self.liElms.length - 1){
        self.liIndex++;
        self.move(self.liIndex);
    }else{
        self.move(self.liIndex);
    }
}

fn.move = function(index){
    var self = this,
        navElms = self.navElms,
        prevBtnElm = self.prevBtnElm,
        nextBtnElm = self.nextBtnElm;
    if(navElms){
        for(i=0, il=navElms.length; i<il; i++){
            (i == index)
            ? navElms[i].classList.add('current')
            : navElms[i].classList.remove('current');
        }
    }
    if(prevBtnElm && nextBtnElm){
        if(self.liIndex == 0){
            prevBtnElm.classList.add('disable');
            nextBtnElm.classList.remove('disable');
        }else if(self.liIndex == self.liElms.length - 1){
            nextBtnElm.classList.add('disable');
            prevBtnElm.classList.remove('disable');
        }else{
            prevBtnElm.classList.remove('disable');
            nextBtnElm.classList.remove('disable');
        }
    }
    ui.translateX(self.liWrapElm, self.liWidth * -index, '300ms');
}

fn.swipe = function(){
    var self = this,
        elm = self.liWrapElm;
    elm.addEventListener('touchmove', drag, false);
    elm.addEventListener('touchend', toPrevNext, false);
    elm.addEventListener('touchend', listenerCancel, false);
    function drag(){
        var diffX = self.touchstartX - self.touchmoveX,
            x = self.liIndex * self.liWidth + diffX;
        ui.translateX(elm, -x, '0');
    }
    function toPrevNext(){
        var blankSpace = 50;
        if(self.touchstartX + blankSpace < self.touchendX){
            self.prev();
        }else if(self.touchstartX - blankSpace > self.touchendX){
            self.next();
        }else{
            self.move(self.liIndex);
        }
    }
    function listenerCancel(){
        elm.removeEventListener('touchmove', drag, false);
        elm.removeEventListener('touchend', toPrevNext, false);
        elm.removeEventListener('touchend', listenerCancel, false);
    }
}
fn.debug = function(){
    var self = this,
        sElm = document.createElement('p'),
        mElm = document.createElement('p'),
        eElm = document.createElement('p'),
        indexElm = document.createElement('p'),
        bnrImgElms = self.liWrapElm.querySelectorAll('li img');

    document.body.appendChild(sElm);
    document.body.appendChild(mElm);
    document.body.appendChild(eElm);
    document.body.appendChild(indexElm);

    sElm.innerHTML = "touchstart X : " + 0;
    mElm.innerHTML = "touchmove X : " + 0;
    eElm.innerHTML = "touchend X : " + 0;
    indexElm.innerHTML = "index : " + self.liIndex;
    self.liWrapElm.addEventListener('touchstart', function(){
        sElm.innerHTML = "touchstart X : " + self.touchstartX;
    }, false);
    self.liWrapElm.addEventListener('touchmove', function(){
        mElm.innerHTML = "touchmove X : " + self.touchmoveX;
    }, false);
    self.liWrapElm.addEventListener('touchend', function(){
        eElm.innerHTML = "touchend X : " + self.touchendX;
    }, false);
    self.liWrapElm.addEventListener('webkitTransitionEnd', function(){
        indexElm.innerHTML = "index : " + self.liIndex;
    }, false);
    for(i=0, il=bnrImgElms.length; i<il; i++){
        bnrImgElms[i].addEventListener('touchstart', ui.preventDefault, false);
    }
}
})(this, this.document);
