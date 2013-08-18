'use strict';

// common UI Library
(function(g, d){
var ns = g.ui = {},
    i,
    il;

function transform(elm, prop){
    elm.style.transform =
    elm.style.webkitTransform =
    elm.style.MozTransform =
    elm.style.OTransform =
    prop;
}
function preventDefault(){
    event.preventDefault();
}
ns.transform = transform;
ns.preventDefault = preventDefault;
})(this, this.document);

// Carousel
(function(g, d){
var ns = g.ui,
    i,
    il;
function Carousel(opt){
    this.carouselElm = opt.carouselElm;
    this.liWrapElm = opt.liWrapElm;
    this.liElms = opt.liElms;
    this.liWidth = opt.liWidth;
    this.liIndex = opt.liIndex || 0;
    this.navElms = opt.navElms || 0;
    this.prevBtnElm = opt.prevBtnElm;
    this.nextBtnElm = opt.nextBtnElm;

    this.init();
    if(opt.debugMode == true){
        this.debug();
    }
}

var fn = Carousel.prototype;

fn.init = function(){
    var self = this,
        me = this.init;
    me.liIndex = self.liIndex;
    me.liWrapElm = self.liWrapElm;
    me.liElms = self.liElms;
    me.liWidth = self.liWidth;
    me.navElms = self.navElms;

    self.liWrapElm.addEventListener('touchstart', function(){
        me.touchstartX = event.touches[0].pageX;
        fn.swipe();
    }, false);
    self.liWrapElm.addEventListener('touchmove', function(){
        me.touchmoveX = event.touches[0].pageX;
    }, false);
    self.liWrapElm.addEventListener('touchend', function(){
        me.touchendX = event.changedTouches[0].pageX;
    }, false);

    self.liWrapElm.style.marginLeft = -self.liWidth/2 + 'px';
    me.navElms[0].classList.add('current');
    // self.liWrapElm.addEventListener('touchstart', function(){
    //     // event.preventDefault();
    //     this.pageX = event.changedTouches[0].pageX;
    //     // this.pageY = event.changedTouches[0].pageY;
    //     this.startPageX = this.pageX;
    //     this.startTime = +new Date();
    // }, false);
    // this.liWrapElm.style.webkit

    this.prevBtnElm.addEventListener('click', fn.prev, false);
    this.nextBtnElm.addEventListener('click', fn.next, false);
}

fn.prev = function(){
    if(fn.init.liIndex > 0){
        fn.init.liIndex--;
        fn.move(fn.init.liIndex);
    }else{
        console.log('これ以上戻れません');
    }
}

fn.next = function(){
    if(fn.init.liIndex < fn.init.liElms.length - 1){
        fn.init.liIndex++;
        fn.move(fn.init.liIndex);
    }else{
        console.log('これ以上送れません');
    }
}

fn.move = function(index){
    var elm = fn.init.liWrapElm,
        w = fn.init.liWidth;
    ui.transform(elm, 'translateX(' + w * -index +'px)');
    for(i=0, il=fn.init.navElms.length; i<il; i++){
        if(i == index){
            fn.init.navElms[i].classList.add('current');
        }else{
            fn.init.navElms[i].classList.remove('current');
        }
    }
}
fn.swipe = function(){
    var elm = fn.init.liWrapElm;
    // var tmpX = fn.init.touchmoveX - fn.init.touchstartX;
    // ui.transform(elm, 'translateX(' + tmpX +'px)');
    console.log(fn.init.touchstartX);
    console.log(fn.init.touchmoveX);

    elm.addEventListener('touchend', hoge, false);
    elm.addEventListener('touchend', listenerCancel, false);
    function hoge(){
        if(fn.init.touchstartX < fn.init.touchendX){
            fn.prev();
        }else if(fn.init.touchstartX > fn.init.touchendX){
            fn.next();
        }else{
            moveCancel()
        }
    }
    function moveCancel(){
    }
    function listenerCancel(){
        elm.removeEventListener('touchend', hoge, false);
        elm.removeEventListener('touchend', listenerCancel, false);
    }
}
fn.debug = function(){
    var sElm = d.createElement('p'),
        mElm = d.createElement('p'),
        eElm = d.createElement('p'),
        indexElm = d.createElement('p'),
        bnrImgElms = this.liWrapElm.querySelectorAll('li img');

    d.body.appendChild(sElm);
    d.body.appendChild(mElm);
    d.body.appendChild(eElm);
    d.body.appendChild(indexElm);

    sElm.innerHTML = "touchstart X : " + 0;
    mElm.innerHTML = "touchmove X : " + 0;
    eElm.innerHTML = "touchend X : " + 0;
    indexElm.innerHTML = "index : " + fn.init.liIndex;
    this.liWrapElm.addEventListener('touchstart', function(){
        sElm.innerHTML = "touchstart X : " + fn.init.touchstartX;
    }, false);
    this.liWrapElm.addEventListener('touchmove', function(){
        mElm.innerHTML = "touchmove X : " + fn.init.touchmoveX;
    }, false);
    this.liWrapElm.addEventListener('touchend', function(){
        eElm.innerHTML = "touchend X : " + fn.init.touchendX;
    }, false);
    this.liWrapElm.addEventListener('transitionend', function(){
        indexElm.innerHTML = "index : " + fn.init.liIndex;
    }, false);
    for(i=0, il=bnrImgElms.length; i<il; i++){
        bnrImgElms[i].addEventListener('touchstart', ui.preventDefault, false);
    }
}
ns.Carousel = Carousel;
})(this, this.document);



