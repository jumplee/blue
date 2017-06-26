/**
 * 依赖jquery和tween.js，一个简单slider组件
 * @param options
 * @constructor
 */
function Slider(options){
	var defaultOptions={
		autoPlay:false,
		timeout:3000,
		animation:'slide',
		showControl:true,
		showDots:true
	};

	var opt=$.extend({},defaultOptions,options);

	//内部变量
	var index=0;
	var preIndex=0;
	var autoPlayIntervalFlag;
	var childrenCls='.slide-item';
	var $root=$(options.element);
	var sliderLen=$root.children(childrenCls).size();
	var $dots;
	var animationOrder=[];
	//对外接口
	var self={
		getRoot:function(){
			return $root.get(0);
		},
		getSize:function () {
			return sliderLen
		},
		getIndex:function () {
			return index;
		},
		addAnimation:function(func){
			if(typeof func == "function"){
				animationFns.push(func)
			}else{
				animationFns.concat(func)
			}
		}
	}
	self.goto=function(page){
		//循环逻辑
		if(page>sliderLen||page==sliderLen){
			page=0;
		}
		if(page<0){
			page=sliderLen-1;
		}
		index=page;
		//重复点击无效
		if(preIndex!==index){
			var dtd =$.Deferred();
			var newSlide=$root.children(childrenCls).get(index);
			var oldSlide=$root.children(childrenCls).get(preIndex);
			//dots逻辑
			var $dots=$root.find('.slide-dots');
			$dots.children().removeClass('active');
			$dots.children().eq(index).addClass('active');
			preIndex=index;
			queue.add(function() {
				if(typeof opt.animationFn==="function"){
					opt.animationFn(newSlide,oldSlide,function () {
						animationFnCallback();
					},index,preIndex);
				}else{
					animationFns[opt.animation](newSlide,oldSlide,function () {
						animationFnCallback();
					},index,preIndex);
				}
				return dtd.promise();
			})
			if(!queue.isRun()){
				queue.run();
			}
		}
		function animationFnCallback() {
			dtd.resolve();
		}
	}
	self.next=function() {
		index++;
		self.goto(index);
	}
	self.pre=function() {
		index--;
		self.goto(index);
	}

	//-----init

	//是否自动播放
	if(opt.autoPlay){
		autoPlayIntervalFlag=setInterval(function () {
			self.next()
		},opt.timeout);
	}
	//组件生成

	function buildController(){
		if(opt.showControl){
			$root.on('mouseover',function () {
				$(this).addClass('mouse-on');
			});
			$root.on('mouseout',function () {
				$(this).removeClass('mouse-on');
			});
			$root.append(templates['nav']);
		}
		var dotStr='<div class="slide-dots">';
		for(var i=0;i<sliderLen;i++){
			dotStr+='<div class="icon-font icon-dot"></div>'
		}
		dotStr+='</div>';
		if(opt.showDots){
			$root.append(dotStr);
		}
	}

	function initEvent(){
		var $navs=$root.find('.slide-nav');
		if($navs){
			$navs.on('click',debounce(onNavClick,300,true))
		}
		function onNavClick(){
			var $this=$(this);
			if($this.hasClass('nav-right')){
				self.next();
			}else{
				self.pre();
			}
		}

		var $dots=$root.find('.slide-dots');
		//初始化事件
		if($dots){
			$dots.children().eq(index).addClass('active');
			$dots.children().on('click',debounce(dotsClick,300,true));
		}
		function dotsClick(){
			self.goto($(this).index());
		}
	}

	buildController();
	initEvent();
	return self;
}

var animationFns={
	slide:function (newSlide, oldSlide,callback) {
		var $newSlide=$(newSlide);
		var $oldSlide=$(oldSlide);
		var time=500;
		newSlide.style.left="100%";
		// console.log('log:add actived');
		// console.log(oldSlide);
		$newSlide.addClass('actived');
		oldSlide.style.position='absolute';
		$newSlide.animate({
			left:'0'
		},time,function () {

		});
		$oldSlide.animate({
			left:'-100%'
		},time,function () {
			oldSlide.style.position='';
			// console.log('log:remove actived');
			$oldSlide.removeClass('actived');
			callback();
		});
	},
	fade:function (newSlide, oldSlide,callback) {
		var $newSlide=$(newSlide);
		var $oldSlide=$(oldSlide);
		var time=700;
		$newSlide.addClass('actived');
		oldSlide.style.position='absolute';
		newSlide.style.opacity=0;
		$newSlide.animate({
			opacity:1
		},time,function () {

		});
		$oldSlide.animate({
			opacity:0
		},time,function () {
			oldSlide.style.position='';
			$oldSlide.removeClass('actived');
			callback();
		});
	}
}
var templates={
	nav:'<div class="slide-nav slide-left">' +
	'<div class="slide-nav-background"></div>' +
	'<i class="slide-nav-icon icon-font icon-left"></i>' +
	'</div>' +
	'<div class="slide-nav slide-right">' +
	'<div class="slide-nav-background"></div>' +
	'<i class="slide-nav-icon icon-font icon-right"></i>' +
	'</div>',
}

function Queue(){
	var self={
		queues:[],
		add:function(fn){
			this.queues.push(fn)
		},
		remove:function () {
			this.queues.shift();
		},
		isRun:function () {
			return isRun;
		},
		run:function () {
			run();
		}
	};
	var isRun=false;
	function run() {
		var fn=self.queues.shift();
		if(fn){
			isRun=true;
			fn().then(function(){
				setTimeout(function(){
					run()
				},1000);
			})
		}else{
			isRun=false;
		}
	}
	return self;
}
var queue=new Queue();
function debounce(func, wait, immediate){
	var timeout, args, context, timestamp, result;
	if (null == wait) wait = 100;

	function later() {
		var last = Date.now() - timestamp;

		if (last < wait && last >= 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			if (!immediate) {
				result = func.apply(context, args);
				context = args = null;
			}
		}
	};

	var debounced = function(){
		context = this;
		args = arguments;
		timestamp = Date.now();
		var callNow = immediate && !timeout;
		if (!timeout) timeout = setTimeout(later, wait);
		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};

	debounced.clear = function() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
	};

	debounced.flush = function() {
		if (timeout) {
			result = func.apply(context, args);
			context = args = null;

			clearTimeout(timeout);
			timeout = null;
		}
	};

	return debounced;
};