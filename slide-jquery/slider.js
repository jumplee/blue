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
		showControl:true
	};

	var opt=$.extend({},defaultOptions,options);

	//内部变量
	var index=0;
	var preIndex=0;
	var autoPlayIntervalFlag;
	var childrenCls='.slide-item';
	var $root=$(options.element);
	var sliderLen=$root.children(childrenCls).size();


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
		if(page>sliderLen||page==sliderLen){
			page=0;
		}
		index=page;
		if(preIndex!==index){
			var newSlide=$root.children(childrenCls).get(index);
			var oldSlide=$root.children(childrenCls).get(preIndex);
			if(typeof opt.animationFn==="function"){
				opt.animationFn(newSlide,oldSlide,function () {
					animationFnCallback();
				})
			}else{
				animationFns[opt.animation](newSlide,oldSlide,function () {
					animationFnCallback();
				});
			}
		}
		function animationFnCallback() {
			preIndex=index;
		}
	}
	self.next=function() {
		index++;
		self.goto(index);
	}

	//-----init

	//是否自动播放
	if(opt.autoPlay){
		autoPlayIntervalFlag=setInterval(function () {
			self.next()
		},opt.timeout)
	}

	if(opt.showControl){
		
	}
	return self;
}

var animationFns={
	slide:function (newSlide, oldSlide,callback) {
		var $newSlide=$(newSlide);
		var $oldSlide=$(oldSlide);
		var time=1000;
		newSlide.style.left="100%";
		$newSlide.addClass('actived');
		oldSlide.style.position='absolute';
		$(newSlide).animate({
			left:'0'
		},time,function () {

		});
		$(oldSlide).animate({
			left:'-100%'
		},time,function () {
			oldSlide.style.position='';
			$oldSlide.removeClass('actived');
			callback();
		});
	},
	fade:function (newSlide, oldSlide,callback) {
		var $newSlide=$(newSlide);
		var $oldSlide=$(oldSlide);
		var time=1000;
		$newSlide.addClass('actived');
		oldSlide.style.position='absolute';
		newSlide.style.opacity=0;
		$(newSlide).animate({
			opacity:1
		},time,function () {

		});
		$(oldSlide).animate({
			opacity:0
		},time,function () {
			oldSlide.style.position='';
			$oldSlide.removeClass('actived');
			callback();
		});
	}
}