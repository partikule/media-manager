<template>

    <div class="inline">
        <button v-show="isShow"
                class="button"
                :title="title"
                :class="['is-' + type, button_class]"
                type="button"
                :disabled="isDisabled"
                @click="switchConfirm"

        >
            <span class="icon" v-if="icon">
                <i :class="['fa', 'fa-' + icon]"></i>
            </span>
            <span v-if="label">
                {{label}}
            </span>
        </button>

        <button v-show="isShowConfirm"
                class="button"
                :class="['is-' + type_confirm, button_confirm_class]"
                type="button"
                @click="actionConfirmed"
        >
            <span class="icon" v-if="icon_confirm">
                <i :class="['fa', 'fa-' + icon_confirm]"></i>
            </span>
            <span v-if="label_confirm">
                {{label_confirm}}
            </span>
        </button>
    </div>


</template>
<script>
    export default {
        props: {
        	type: {
        	    type: String,
                default: 'danger'
            },
        	type_confirm: {
        	    type: String,
                default: 'danger'
            },
            icon: {
                type: String,
                default: null
            },
            icon_confirm: {
                type: String,
                default: null
            },
            label: {
                type: String,
                default: null
            },
            label_confirm: {
                type: String,
                default: 'Do you confirm?'
            },
            button_class: {
        	    type: String,
                default: ''
            },
			button_confirm_class: {
        	    type: String,
                default: ''
            },
            title: {
        	    type: String,
                default: null
            },
            onClick: {
                type: Function,
                default: null
            },
            disable: {
        		type: Boolean,
                default: false
            }
        },

        computed: {
        	isDisabled(){
        		return this.disable;
            }
        },

        data() {
            return {
				timeoutId: null,
                isShow: true,
                isShowConfirm: false,
                isConfirmed: false
            }
        },

        methods: {

            switchConfirm() {

                this.isShow = false;
                this.isShowConfirm = true;

                clearTimeout(this.timeoutId);

                this.timeoutId = setTimeout(() => {
                    this.isShow = true;
                    this.isShowConfirm = false;
                }, 4000);
            },

            actionConfirmed()
            {
                this.onClick();
                this.isConfirmed = true;

                this.isShow = true;
                this.isShowConfirm = false;
            }
        }
    };

</script>
