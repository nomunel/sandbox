'use strict';

// Common UI Library
(function(g, d){
var ns = g.ui = {},
    i,
    il;
ns.transform = function(elm, prop, duration){
    elm.style.transform =
    elm.style.webkitTransform =
    elm.style.MozTransform =
    elm.style.OTransform =
    prop;
    elm.style.transitionDuration =
    elm.style.webkitTransitionDuration =
    elm.style.MozTransitionDuration =
    elm.style.OTransitionDuration =
    duration;
    
}
ns.preventDefault = function(){
    event.preventDefault();
}
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
    this.loopTime = opt.loopTime || 0;

    if(this.loopTime !== 0){
        this.autoLoop();
    }
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
    me.prevBtnElm = self.prevBtnElm;
    me.nextBtnElm = self.nextBtnElm;

    fn.move(self.liIndex);
    self.liWrapElm.style.marginLeft = -self.liWidth/2 + 'px';
    self.prevBtnElm.addEventListener('touchstart', fn.autoLoop.stop, false);
    self.nextBtnElm.addEventListener('touchstart', fn.autoLoop.stop, false);

    self.prevBtnElm.addEventListener('touchend', function(){
        fn.prev();
        fn.autoLoop.play();
    }, false);
    self.nextBtnElm.addEventListener('touchend', function(){
        fn.next();
        fn.autoLoop.play();
    }, false);

    self.liWrapElm.addEventListener('touchstart', function(){
        me.touchstartX = event.touches[0].pageX;
        fn.swipe();
        fn.autoLoop.stop();
    }, false);
    self.liWrapElm.addEventListener('touchmove', function(){
        me.touchmoveX = event.touches[0].pageX;
    }, false);
    self.liWrapElm.addEventListener('touchend', function(){
        me.touchendX = event.changedTouches[0].pageX;
        fn.autoLoop.play();
    }, false);

}
fn.autoLoop = function(){
    var self = this,
        me = self.autoLoop;
    me.play = function(){
        me.control = setInterval(function(){
            if(fn.init.liIndex < fn.init.liElms.length - 1){
                fn.next();
            }else{
                fn.init.liIndex = 0;
                fn.move(0);
            }
        }, self.loopTime);
    }
    me.stop = function(){
        clearInterval(me.control);
    }
    me.play();
 }

fn.prev = function(){
    if(fn.init.liIndex > 0){
        fn.init.liIndex--;
        fn.move(fn.init.liIndex);
    }else{
        fn.move(fn.init.liIndex);
        console.log('これ以上戻れません');
    }
}

fn.next = function(){
    if(fn.init.liIndex < fn.init.liElms.length - 1){
        fn.init.liIndex++;
        fn.move(fn.init.liIndex);
    }else{
        fn.move(fn.init.liIndex);
        console.log('これ以上送れません');
    }
}

fn.move = function(index){
    var navElms = fn.init.navElms,
        prevBtnElm = fn.init.prevBtnElm,
        nextBtnElm = fn.init.nextBtnElm;
    for(i=0, il=navElms.length; i<il; i++){
        if(i == index){
            navElms[i].classList.add('current');
        }else{
            navElms[i].classList.remove('current');
        }
    }
    if(fn.init.liIndex == 0){
        prevBtnElm.classList.add('disable');
        nextBtnElm.classList.remove('disable');
    }else if(fn.init.liIndex == fn.init.liElms.length - 1){
        nextBtnElm.classList.add('disable');
        prevBtnElm.classList.remove('disable');
    }else{
        prevBtnElm.classList.remove('disable');
        nextBtnElm.classList.remove('disable');
    }
    ui.transform(fn.init.liWrapElm, 'translate3d(' + fn.init.liWidth * -index +'px, 0, 0)', '300ms');
}
fn.swipe = function(){
    var elm = fn.init.liWrapElm;
    elm.addEventListener('touchmove', drag, false);
    elm.addEventListener('touchend', toPrevNext, false);
    elm.addEventListener('touchend', listenerCancel, false);
    function drag(){
        var diffX = fn.init.touchstartX - fn.init.touchmoveX,
            x = fn.init.liIndex * fn.init.liWidth + diffX;
        ui.transform(elm, 'translate3d(' + -x + 'px, 0, 0)', '0');
    }
    function toPrevNext(){
        var blankSpace = 50;
        if(fn.init.touchstartX + blankSpace < fn.init.touchendX){
            fn.prev();
        }else if(fn.init.touchstartX - blankSpace > fn.init.touchendX){
            fn.next();
        }else{
            fn.move(fn.init.liIndex);
        }
    }
    function listenerCancel(){
        elm.removeEventListener('touchmove', drag, false);
        elm.removeEventListener('touchend', toPrevNext, false);
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
    this.liWrapElm.addEventListener('webkitTransitionEnd', function(){
        indexElm.innerHTML = "index : " + fn.init.liIndex;
    }, false);
    for(i=0, il=bnrImgElms.length; i<il; i++){
        bnrImgElms[i].addEventListener('touchstart', ui.preventDefault, false);
    }
}
ns.Carousel = Carousel;
})(this, this.document);



