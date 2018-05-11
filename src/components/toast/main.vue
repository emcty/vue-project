<style scoped>
.toast {
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  padding: 7px 15px;
  line-height: 22px;
  border-radius: 3px;
  text-align: center;
  z-index: 9;
}

.toast-transition {
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.toast-enter,
.toast-leave {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.2);
}
</style>

<template>
  <div class="toast" v-show="visible" transition="toast">
    <div v-text="message"></div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      visible: false,
      message: "",
      duration: 3000
    };
  },
  watch:{
    visible(value){
      if(this.timer){
        clearTimeout(this.timer);
      }
      if(value){
        this.timer = setTimeout(()=>{
          this.visible = false;
          this.hide();
        },this.duration);
      }
    }
  },
  methods: {
    hide() {
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>
