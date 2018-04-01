<template>

	<modal :title="trans('mediamanager.button.create_folder.label')"
		   :ok-text="trans('mediamanager.button.create_folder.label')"
		   :width="520"
		   :is-show="show"
		   :on-ok="create"
		   :on-cancel="close"
		   :on-active="focusOnInput"
	>

		<div slot="body">

			<div class="field">

				<label class="label">{{ trans('mediamanager.label.folder_name') }}</label>

				<input v-validate="'required'"
					   class="input"
					   name="name"
					   type="text"
					   v-model="newFolderName"
					   :class="{'is-danger': errors.has('name') }"
					   @keyup.enter="create"
				>

				<span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>

			</div>
		</div>
	</modal>
</template>

<script>
	import Modal from '../../modal';
	import mixins from '../mixins/file-manager-mixin';

	export default{
		components: {
			Modal
		},
		mixins: [mixins],
		props:{
			currentPath:{},

			show:{
				default : false
			}
		},
		data(){
			return {
				newFolderName: null
			}
		},
		methods: {
			close(){
				this.newFolderName = null;
				this.$emit('close');
			},
			focusOnInput(){

				let el = this.$el.querySelector('.input');

				setTimeout(function(){
					el.focus()
				}, 100);
			},
			create(){
				this.$validator.validateAll().then(result =>
				{
					if (result)
					{
						this.$emit('create', this.newFolderName);
					}
				});
			}
		}
	}
</script>
