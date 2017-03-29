var Slide = {
    name: 'Slide',
    template: document.getElementById('slide_component').innerHTML,
    data: function () {
        return {
            actived: false
        }
    },
    methods: {

    }
}
var slidesComponent = {
    template: document.getElementById('slides_component').innerHTML,
    props: {
        activeIndex: {
            type: Number,
            default: 0
        }
    },
    data: function () {
        return {
            childItems: [],
            startAnim: false,
            reverse: false,
            activedIndex:-1
        }
    },
    mounted: function () {
        
        this.childItems = this.$children.filter(function (child) {
            return child.$options.name === 'Slide'
        })
        if(this.activeIndex >=0 && this.activeIndex < this.childItems.length){
            this.activedIndex = this.activeIndex
        }
        this.childItems[this.activedIndex].actived = true
    },
    methods: {
        go: function (index) {
            if (index >= 0 && index < this.childItems.length) {
                //如果是反向打开
                if (this.activedIndex > index) {
                    this.reverse = true
                } else {
                    this.reverse = false
                }
                this.activedIndex = index
            }
        },
        next: function () {
            this.go(this.activedIndex + 1)
        },
        before: function () {
            this.go(this.activedIndex - 1)
        }
    },
    watch:{
        reverse:function(){
            
        },
        activedIndex:function(newVal,oldVal){
            //初始化改变的时候不需要触发动画
            if(oldVal==-1){
                return false
            }
            var oldView=this.childItems[oldVal].$el
            var newView=this.childItems[newVal].$el
            var counter=0;
            var enterClass='slide-enter'
            var leaveClass = 'slide-leave'
            if(this.reverse){
                enterClass = 'slide-enter-reverse'
                leaveClass = 'slide-leave-reverse'
            }
            function onEnd(){
                newView.classList.remove(enterClass)
                oldView.classList.remove(leaveClass)
                oldView.classList.remove('actived')
                newView.style.position='relative'
            }
            var newViewAnim=newView.addEventListener('animationend',function(){
                newView.removeEventListener('animationend',newViewAnim)
                counter++
                if(counter===2){
                    onEnd()
                }
            })
            var oldViewAnim=oldView.addEventListener('animationend',function(){
                oldView.removeEventListener('animationend',oldViewAnim)
                counter++
                if(counter===2){
                    onEnd()
                }
            })
            oldView.classList.add(leaveClass)
            newView.classList.add('actived')
            newView.style.position='absolute'
            newView.classList.add(enterClass)
           
        }
    }
}