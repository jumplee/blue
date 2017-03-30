var Slide = {
    name: 'Slide',
    template: document.getElementById('slide_component').innerHTML,

    data: function () {
        return {
            x: 0,
            actived: false
        }
    },
    methods: {
        updateTransform: function (x) {
            this.x = x
        }
    },
    computed: {
        styles: function () {
            return {
                'transform': 'translateX(' + this.x + '%)'
            }
        }
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
            activedIndex: -1
        }
    },
    mounted: function () {

        this.childItems = this.$children.filter(function (child) {
            return child.$options.name === 'Slide'
        })
        if (this.activeIndex >= 0 && this.activeIndex < this.childItems.length) {
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
    watch: {
        reverse: function () {

        },
        activedIndex: function (newVal, oldVal) {
            //初始化改变的时候不需要触发动画
            if (oldVal == -1) {
                return false
            }
            var oldView = this.childItems[oldVal]
            var newView = this.childItems[newVal]
            newView.$el.classList.add('actived')
            newView.$el.style.position = 'absolute'
            var animationFrame

            function animate(time) {
                TWEEN.update(time)
                animationFrame = requestAnimationFrame(animate)
            }
            var fromObj = {
                x: 0,
                x2: 100
            }
            var toObj = {
                x: -100,
                x2: 0
            }
            if(this.reverse){
                fromObj={
                    x:0,
                    x2:-100
                }
                toObj={
                    x:100,
                    x2:0
                }
            }
            new TWEEN.Tween(fromObj)
                .to(toObj, 750)
                .onUpdate(function () {
                    oldView.x = this.x
                    newView.x = this.x2
                })
                .easing(TWEEN.Easing.Cubic.InOut)
                .onComplete(function () {
                    oldView.$el.classList.remove('actived')
                    newView.$el.style.position = ''
                    cancelAnimationFrame(animationFrame)
                    
                    
                })
                .start()
            animationFrame = requestAnimationFrame(animate)
        }
    }
}