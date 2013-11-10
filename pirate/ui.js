'use strict';

(function(global, document){
var fn;
global.ModalWindow = function(){
    this.init.apply(this, arguments);
}
fn = global.ModalWindow.prototype;
fn.init = function(element, topVal){
    var self = this,
        i, il;
    self.element = element;
    if (typeof element === 'string') {
        self.element = document.querySelector(element);
    }
    self.topVal = topVal;
}
fn.setMask = function(maskElm){
    this.maskElm = document.querySelector(maskElm);
}
fn.setOpen = function(openElms){
    var self = this,
        elms = document.querySelectorAll(openElms),
        i, il;
    for(i=0, il=elms.length; i<il; i++){
        elms[i].addEventListener('click', self.modalOpen.bind(self), false);
    }
}
fn.setClose = function(closeElms){
    var self = this,
        elms = document.querySelectorAll(closeElms),
        i, il;
    for(i=0, il=elms.length; i<il; i++){
        elms[i].addEventListener('click', self.modalClose.bind(self), false);
    }
}
fn.modalOpen = function(){
    var self = this;
    self.element.style.display = 'block';
    self.maskElm.style.display = 'block';
    self.maskElm.style.height = document.body.scrollHeight + 'px';
    if(self.topVal != false){
        self.element.style.top = document.body.scrollTop + self.topVal + 'px';
    }

}
fn.modalClose = function(){
    var self = this;
    self.element.style.display = 'none';
    self.maskElm.style.display = 'none';
}
})(this, this.document);



(function(global, document){
var fn;
global.ItemListControl = function(){
    this.init.apply(this, arguments);
}
fn = global.ItemListControl.prototype;
fn.init = function(opt){
    var self = this,
        i, il,
        j, jl;
    self.index = opt.index || 0;

    self.navElms = document.querySelectorAll(opt.navElms);
    self.navLiElms = [];
    self.prevElms = [];
    self.nextElms = [];
    for(i=0, il=self.navElms.length; i<il; i++){
        self.navLiElms[i] = self.navElms[i].querySelectorAll('li');
        for(j=0, jl=self.navLiElms[i].length; j<jl; j++){
            self.navLiElms[i][j].addEventListener('click', self.set.bind(self, j), false);
        }
        self.navLiElms[i]
        self.prevElms[i] = self.navElms[i].querySelector('.prev');
        self.nextElms[i] = self.navElms[i].querySelector('.next');
        self.prevElms[i].addEventListener('click', self.prev.bind(self), false);
        self.nextElms[i].addEventListener('click', self.next.bind(self), false);
    }

    self.itemElms = document.querySelectorAll(opt.itemElms);
    self.groupMemberNum = opt.groupMemberNum;
    self.groupNum = Math.ceil(self.itemElms.length / self.groupMemberNum);
    self.groups = new Array(self.groupNum);
    self.listGrouping();

    self.set(self.index);
}
fn.set = function(setIndex){
    var self = this,
        index = self.index = setIndex,
        i, il;
    for(i=0, il=self.groups.length; i<il; i++){
        if(i===index){
            self.displaySwitch(i, 'block');
        }else{
            self.displaySwitch(i, 'none');
        }
    }
}
fn.listGrouping = function(){
    var self = this,
        itemElms = self.itemElms,
        groupMemberNum = self.groupMemberNum,
        groupNum = self.groupNum,
        groups = self.groups,
        i, il,
        j, jl;
    for(i=0, il=groups.length; i<il; i++){
        groups[i] = [];
        for(j=0, jl=itemElms.length; j<jl; j++){
            if(j >= (((i+1)*groupMemberNum) - groupMemberNum) && j < (i+1)*groupMemberNum){
                groups[i].push(itemElms[j]);
            }
        }
    }
}
fn.displaySwitch = function(num, displayVal){
    var self = this,
        navLiElms = self.navLiElms,
        i, il,
        j, jl;
    for(i=0, il=self.groups[num].length; i<il; i++){
        self.groups[num][i].style.display = displayVal;
    }
    for(i=0, il=navLiElms.length; i<il; i++){
        for(j=0, jl=self.groups.length; j<jl; j++){
            if(j===self.index){
                navLiElms[i][j].classList.add('current');
            }else{
                navLiElms[i][j].classList.remove('current');
            }
        }
    }
    if(self.index === 0){
        for(i=0, il=navLiElms.length; i<il; i++){
            self.prevElms[i].disabled = true;
        }
    }else{
        for(i=0, il=navLiElms.length; i<il; i++){
            self.prevElms[i].disabled = false;
        }
    }
    if(self.index === self.groupNum-1){
        for(i=0, il=navLiElms.length; i<il; i++){
            self.nextElms[i].disabled = true;
        }
    }else{
        for(i=0, il=navLiElms.length; i<il; i++){
            self.nextElms[i].disabled = false;
        }
    }
}
fn.prev = function(){
    var self = this;
    if(self.index > 0){
        self.index--;
        self.set(self.index);
    }
}
fn.next = function(){
    var self = this;
    if(self.index < self.groupNum-1){
        self.index++;
        self.set(self.index);
    }
}
})(this, this.document);
