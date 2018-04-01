<template>
	<transition :name="transitionName">
		<div class="notification alert" :class="[typeClass, hasIcon, hasAction]" v-show="isShow" @click="handleClose">
			<div class="wrap-icon" v-if="iconClass"><i :class="['fa', `fa-${iconClass}`, faSpin]"></i></div>
			<div>
				<div class="title is-5" v-if="title">{{ title }}</div>
				<div class="notification-content" v-html="content"></div>
			</div>
			<div v-if="actionText"
				 class="action"
				 @click.exact="action"
				 :class="typeClass">
				<button class="button" :class="typeClass">{{ actionText }}</button>
			</div>
		</div>
	</transition>
</template>
<script>
	export default {
		props: {
			container: {
				type: String,
				default: '.notifications'
			},
			type: {
				type: String,
				default: 'default',
			},
			title: {
				type: String,
			},
			content: {
				type: String,
				default: '',
			},
			actionText: {
				type: String,
				default: null
			},
			onAction: {
				type: Function,
				default: () => {
				}
			},
			onOpen: {
				type: Function,
				default: () => {
				}
			},
			closable: {
				type: Boolean,
				default: true,
			},
			onClose: {
				type: Function,
				default() {
				},
			},
			duration: {
				type: Number,
				default: 4500,
			},
			icon: {
				type: String,
			},
			animated: {
				type: Boolean,
				default: false,
			},
			transition: {
				type: String,
			},
			stack: {
				type: Boolean,
				default: true
			},
			placement: {
				type: String,
				default: 'top-right'
			}
		},

		data() {
			return {
				isShow: false,
				placementTransition: {
					'none': 'fade',
					'top-right': 'fadeRight',
					'top-center': 'fadeDown',
					'top-left': 'fadeLeft',
					'bottom-right': 'fadeRight',
					'bottom-center': 'fadeUp',
					'bottom-left': 'fadeLeft',
				},
				newPlacement: null,
				timeOut: true
			};
		},

		computed: {
			typeClass() {
				return this.type ? `is-${this.type}` : null;
			},
			hasIcon() {
				return this.iconClass ? 'has-icon' : null;
			},
			hasAction() {
				return this.actionText ? 'has-action' : null;
			},
			faSpin() {
				return this.animated ? 'fa-spin' : null;
			},
			iconClass() {
				if (this.icon) return this.icon;

				if (this.type === 'info') {
					return 'info-circle';
				}
				else if (this.type === 'success') {
					return 'check-circle';
				}
				else if (this.type === 'warning') {
					return 'exclamation-triangle';
				}
				else if (this.type === 'danger') {
					return 'times-circle';
				}
				else if (this.type === 'loading') {
					this.type = 'info';
					this.animated = true;
					return 'spinner';
				}
				return this.icon;
			},
			transitionName() {
				if (this.transition) return this.transition;
				return this.placementTransition[this.potentialPlacement];
			},
			potentialPlacement() {
				if (this.newPlacement) return this.newPlacement;
				return this.placement;
			}
		},

		beforeMount() {
			let parent;
			parent = document.querySelector(`${this.container}.${this.placement}`);

			if (!parent && this.container !== '.notifications') {
				parent = document.querySelector(`${this.container}`);
				if (parent) {
					this.newPlacement = 'none';
				}
			}

			if (!parent) {
				const className = this.container.replace('.', '');
				parent = document.createElement('div');
				parent.classList.add(className, this.potentialPlacement);
				document.body.appendChild(parent);
			}

			if (!this.stack && parent) {
				while (parent.firstChild) parent.removeChild(parent.firstChild);
			}

			parent.appendChild(this.$el);
		},

		beforeDestroy() {
			this.disableKeyboardEvents();
		},

		mounted() {
			this.isShow = true;
			if (this.duration > 0)
				this.timer = setTimeout(() => this.handleClose(), this.duration);
			this.onOpen();
			this.enableKeyboardEvents()
		},

		methods: {
			handleClose() {
				this.isShow = false;
				setTimeout(() => {
					this.onClose();
					this.$destroy();
					this.$el.remove();
				}, 300);
			},
			close() {
				clearTimeout(this.timer);
				this.isShow = false;
				this.$destroy();
				this.$el.remove();
			},
			action() {
				this.onAction();
				setTimeout(() => {
					this.handleClose();
				}, 250);
			},
			enableKeyboardEvents(){
				document.addEventListener("keydown", this.keyboardEvents);
			},
			disableKeyboardEvents(){
				document.removeEventListener("keydown", this.keyboardEvents);
			},
			keyboardEvents(e) {

				// Enter : Validate the action
				if (e.keyCode === 13) {
					e.stopPropagation();
					this.action();
				}

				// ESC : Close
				if (e.keyCode === 27) {
					e.stopPropagation();
					this.handleClose();
				}
			}
		},

	};
</script>
