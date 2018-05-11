/**
 * Copyright 2018 jianlc Inc. All rights reserved.
 * @author dinglei(dinglei@jianlc.com)
 * @date 2018/5/10
 */

import Vue from 'vue';
import Toast from './main.vue';

const ToastConstructor = Vue.extend(Toast);

function toast(message = '') {
  if (Vue.prototype.$isServer) return;
  
  let instance = new ToastConstructor({
    data: {
      message
    }
  });

  instance.vm = instance.$mount();

  document.body.appendChild(instance.vm.$el);

  instance.vm.visible = true;


  return instance.vm;
}

toast.install = (Vue) => {
  Vue.prototype.$toast = toast;
}

export default toast;
