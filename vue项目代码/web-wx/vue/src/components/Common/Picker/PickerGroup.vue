<template>
  <div v-if="showPickerGroup" class="weui-picker__group"  @touchstart="handleTouchStart"
       @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <div class="weui-picker__mask"></div>
    <div class="weui-picker__indicator"></div>
    <div class="weui-picker__content" :style="styles">
      <div v-for="(item,index) of items" class="weui-picker__item" :key="index">{{item.label || item}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    props: ['show', 'items', 'defaultIndex','groupIndex'],
    data () {
      return {
        styles: null,
        showPickerGroup: false,
        touching: false,
        ogY: 0,
        ogTranslate: 0,
        touchId: undefined,
        animating: true,
        translate: 0,
        height: 238,
        itemHeight: 25 + 9,
        indicatorTop: 102,
        indicatorHeight: 34,
        aniamtion: true,
        selected: 0,
        mapKeys: {
          label: 'label'
        }
      }
    },
    mounted () {
      this.showPickerGroup = this.show;
      if(!this.items.length) return;
      this.items[this.defaultIndex].index=this.defaultIndex;
      this.adjustPosition(this.defaultIndex,this.items[this.defaultIndex]);
    },
    methods: {
      position(index){
        const totalHeight = this.items.length * this.itemHeight
        let translate = totalHeight <= this.indicatorTop ? this.indicatorTop : 0

        if (index > -1) {
          if (translate === 0) {
            let upperCount = Math.floor(this.indicatorTop / this.itemHeight)
            if (index > upperCount) {
              let overCount = index - upperCount
              translate -= overCount * this.itemHeight
            } else if (index === upperCount) {
              translate = 0
            } else {
              translate += (Math.abs(upperCount - index) * this.itemHeight)
            }
          } else {
            translate -= this.itemHeight * index
          }
        }
        this.selected = index
        this.ogTranslate = translate
        this.totalHeight = totalHeight
        this.translate = translate
        const styles = {
          'transform': 'translate(0, ' + this.translate + 'px)',
          'transition': this.animating ? 'transform .3s' : 'none'
        }
        this.styles = styles;

      },
      adjustPosition (index,option){
        this.position(index);
        this.$emit('sendOptionToParent',this.groupIndex,option)
      },
      handleTouchStart (e) {
        if (this.touching || this.items.length <= 1) return
        this.touching = true
        this.ogTranslate = this.translate
        this.touchId = e.targetTouches[0].identifier
        this.ogY = this.translate === 0 ? e.targetTouches[0].pageY : e.targetTouches[0].pageY - this.translate
        this.animating = false
      },
      handleTouchMove (e) {
        if (!this.touching || this.items.length <= 1) return
        if (e.targetTouches[0].identifier !== this.touchId) return
        e.preventDefault()
        const pageY = e.targetTouches[0].pageY
        const diffY = pageY - this.ogY
        this.translate = diffY
        const styles = {
          'transform': 'translate(0, ' + this.translate + 'px)',
          'transition': this.animating ? 'transform .3s' : 'none'
        }
        this.styles = styles
      },
      handleTouchEnd (e) {
        if (!this.touching || this.items.length <= 1) return
        let translate = this.translate
        if (Math.abs(translate - this.ogTranslate) < (this.itemHeight * 0.51)) {
          translate = this.ogTranslate
        } else if (translate > this.indicatorTop) {
          translate = this.indicatorTop
        } else if (translate + this.totalHeight < this.indicatorTop + this.indicatorHeight) {
          translate = this.indicatorTop + this.indicatorHeight - this.totalHeight
        } else {
          let step = 0
          let adjust = 0
          let diff = (translate - this.ogTranslate) / this.itemHeight
          if (Math.abs(diff) < 1) {
            step = diff > 0 ? 1 : -1
          } else {
            adjust = Math.abs((diff % 1) * 100) > 50 ? 1 : 0
            step = diff > 0 ? Math.floor(diff) + adjust : Math.ceil(diff) - adjust
          }
          translate = this.ogTranslate + (step * this.itemHeight)
        }

        this.touching = false
        this.ogY = 0
        this.touchId = undefined
        this.ogTranslate = 0
        this.animating = true
        this.translate = translate
        this.updateSelected()
      },
      updateSelected (propagate = true) {
        let selected = 0,option={};
        this.items.forEach( (item, i) => {
          if (!item.disabled && (this.translate + (this.itemHeight * i)) >= this.indicatorTop &&
          (this.translate + (this.itemHeight * i) + this.itemHeight ) <= this.indicatorTop + this.indicatorHeight ){
              selected = i;
              item.index=i;
              option=item;
          }
        });
        this.adjustPosition(selected,option)

        if(propagate)this.$emit('handleGroupChange',this.items[selected],selected,this.groupIndex)
      }
    }
  }

</script>
