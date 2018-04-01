<template>
  <transition name="fade">
    <div class="modal align-baseline" v-show="isActive" :class="{ 'is-active': isActive }">
      <div class="modal-background" v-if="backdrop" @click="backdropClose"></div>
      <transition :name="transition">
        <div class="modal-card" :style="modalWidth" v-show="isActive">
        <header class="modal-card-head" v-if="showHeader">
          <slot name="header">
            <p class="modal-card-title">{{ title }}</p>
            <a class="icon close" v-if="showCloseCross" @click="handleCancel"></a>
          </slot>
        </header>
        <section class="modal-card-body">
          <slot name="body"></slot>
        </section>
        <footer class="modal-card-foot" v-if="showFooter">
          <slot name="footer">
            <a class="button is-warning" @click="handleCancel" v-if="showCancel">{{ cancelText }}</a>
            <a class="button is-success" :class="{'is-loading': isLoading}" @click="handleOk" v-if="showOk">{{ okText }}</a>
          </slot>
        </footer>
      </div>
      </transition>
    </div>
  </transition>
</template>
<script>
import ModalMixin from './ModalMixin';

export default {
  mixins: [ModalMixin],
};
</script>
